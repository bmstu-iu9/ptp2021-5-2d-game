import {BaseEnemy} from "../entities/base_enemy.js";
import {Player} from "../player/player.js";
import {configureKeyWatchers} from "../player/keyboard_control.js";
import AssetsManager from "./assets_manager.js";
import Body from "../physics/body.js";
import {applyCollisionRules} from "../physics/collisions.js";
import {DESTRUCTION_REASONS, ENTITY_STATE, GAME_STATE} from "./enums.js";
import Vector from "../math/vector.js";
import {switchToMenu} from "./page.js";
import {PlayerOrbitalShield} from "../entities/player_bullets.js";
import Clock from "../util/clock.js";
import SoundManager from "./sound_manager.js";
import InfiniteModeManager from "./levels/infinite_mode_manager.js";
import Shared from "../util/shared.js";

class Game {
    player

    constructor() {
        // Create canvas and extract its context
        this.viewport = document.getElementById("gameViewport")
        this.viewport.width = window.innerWidth
        this.viewport.height = window.innerHeight
        this.context = this.viewport.getContext('2d')
        document.getElementById("container").insertBefore(this.viewport, null)

        this.context.font = "bold 48px shadows into light"
        this.context.textAlign = "center"

        this.playArea = new Body(new Vector(), window.innerWidth, window.innerHeight)

        this.lastHBarWidth = 260
        this.backgroundObjects = new BackgroundScroller()
            .add('assets/img/stars1.png', 0.5)
            .add('assets/img/stars2.png', 1)
            .add('assets/img/nebula.png', 1)

        this.gameObjects = []

        this.state = GAME_STATE.LOADING

        this.isPressed = {}

        this.scoreDisplayed = 0
    }

    /**
     * Load this Game's assets and prepare to start.
     */
    load() {
        configureKeyWatchers()
        AssetsManager.loadAssets(this.onLoaded)
    }

    /**
     * Callback for load().
     * Shows the game menu.
     */
    onLoaded() {
        game.state = GAME_STATE.MENU
    }

    /**
     * End this game and display "GAME OVER" text. Should be called when Player is destroyed.
     */
    gameover() {
        this.state = GAME_STATE.END
        setTimeout(function () {
            game.reset()
        }, 5000)
    }

    /**
     * Reset the game & switch to main menu.
     */
    reset() {
        this.gameObjects = []
        this.state = GAME_STATE.MENU
        switchToMenu()
    }

    /**
     * Start the game.
     */
    start() {
        if (this.state !== GAME_STATE.MENU)
            return

        Shared.gameWidth = game.playArea.width
        Shared.gameHeight = game.playArea.height
        Shared.player = new Player()
        game.gameObjects.push(Shared.player)

        this.levelManager = new InfiniteModeManager(this)
        game.state = GAME_STATE.RUNNING

        window.requestAnimationFrame(game.gameLoop.bind(game))
    }

    /**
     * Main loop
     *
     * @param ts timestamp passed by requestAnimationFrame()
     */
    gameLoop(ts) {
        if (this.state === GAME_STATE.LOADING || this.state === GAME_STATE.MENU)
            return

        this.update(ts)
        this.render()
        window.requestAnimationFrame(game.gameLoop.bind(game))
    }

    /**
     * Find all colliding objects and apply the corresponding collision rules to them.
     */
    processCollisions() {
        for (let i = 0; i < this.gameObjects.length; i++) {
            if (!this.gameObjects[i].body.canCollide) continue

            for (let j = i + 1; j < this.gameObjects.length; j++) {
                if (this.gameObjects[j].body.canCollide &&
                    this.gameObjects[i].body.collidesWith(this.gameObjects[j].body)) {
                    applyCollisionRules(this.gameObjects[i], this.gameObjects[j])
                }
            }
        }
    }

    /**
     * Update every entity in the game.
     *
     * @param ts timestamp passed by requestAnimationFrame()
     */
    update(ts) {
        Clock.update(ts)

        this.backgroundObjects.update()

        // Update cycle
        for (let i = 0; i < this.gameObjects.length; i++)
            this.gameObjects[i].update()

        // Destroy entities which left the screen
        for (let obj of this.gameObjects) {
            if (!obj.body.collidesWith(this.playArea) && !(obj instanceof PlayerOrbitalShield))
                obj.destroy(DESTRUCTION_REASONS.OUT_OF_BOUNDS)
        }

        this.processCollisions()

        // Process destroyed objects
        for (let i = 0; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i].state === ENTITY_STATE.DESTROYED) {
                let destructionEffect = this.gameObjects[i].destructionEffect,
                    destructionSoundName = this.gameObjects[i].destructionSoundName,
                    destructionReason = this.gameObjects[i].destructionReason;

                if (destructionReason !== DESTRUCTION_REASONS.OUT_OF_BOUNDS) {
                    if (destructionEffect !== null)
                        this.gameObjects.push(destructionEffect)

                    if (destructionSoundName !== null)
                        SoundManager.gameSounds(destructionSoundName)

                    if (this.gameObjects[i].reward)
                        this.levelManager.score += this.gameObjects[i].reward
                }

                if (this.gameObjects[i] instanceof BaseEnemy)
                    this.levelManager.enemiesKilled++

                this.gameObjects.splice(i, 1)
            }
        }

        if (game.state === GAME_STATE.RUNNING)
            game.levelManager.update()
    }

    /**
     * Draw background, UI and call render() for every entity.
     */
    render() {
        this.backgroundObjects.render(this.context)

        // Render all gameObjects
        for (let ent of this.gameObjects) {
            ent.render(this.context)
        }

        // Draw score counter
        if (this.state !== GAME_STATE.END) {
            if (this.scoreDisplayed !== this.levelManager.score) {
                this.scoreDisplayed += Math.min(8, this.levelManager.score - this.scoreDisplayed)
            }
            this.context.fillStyle = "orange";
            this.context.fillText("Total score: " + this.scoreDisplayed, this.viewport.width - 200, 80)
        }

        // Draw HP-bar
        this.context.drawImage(AssetsManager.textures["player_hp_bar_back"].image, 20, 20, 274, 36)

        let barW = 260 * Shared.player.health / 100,
            diff = barW - this.lastHBarWidth
        if (diff !== 0) {
            barW = this.lastHBarWidth + diff * 0.1;
            this.lastHBarWidth = barW
        }

        this.context.drawImage(AssetsManager.textures["player_hp_bar"].image, 0, 0, 260, 20, 27, 28, barW, 20)

        if (this.state === GAME_STATE.BETWEEN_LEVELS || this.state === GAME_STATE.END) {
            let textX = this.viewport.width / 2,
                textY = this.viewport.height / 2;

            if (this.state === GAME_STATE.BETWEEN_LEVELS) {
                this.context.fillStyle = "orange";

                this.context.fillText("Level " + this.levelManager.currentLevelIndex + " passed!", textX, textY)
            } else {
                if (!this.stop1) {
                    this.stop1 = 0
                    this.stop2 = 0.5
                    this.stop3 = 1.0
                }
                this.stop1 += 0.03
                this.stop2 += 0.03
                this.stop3 += 0.03

                if (this.stop1 > 1)
                    this.stop1 = 0

                if (this.stop2 > 1)
                    this.stop2 = 0

                if (this.stop3 > 1)
                    this.stop3 = 0

                this.grad = this.context.createLinearGradient(0, 0, this.viewport.width, 0)
                this.grad.addColorStop(this.stop1, " magenta");
                this.grad.addColorStop(this.stop2, "blue");
                this.grad.addColorStop(this.stop3, "red");

                this.context.fillStyle = this.grad
                this.context.fillText("Game over. Total score: " + this.levelManager.score, textX, textY)
            }
        }
    }

    /**
     * Resize canvas and update sizes when window is resized
     */
    onResize() {
        let ww = window.innerWidth, wh = window.innerHeight

        game.viewport.style.width = ww.toString()
        game.viewport.style.height = wh.toString()

        Shared.gameWidth = game.playArea.width = ww
        Shared.gameHeight = game.playArea.height = wh
    }
}

/**
 * This class draws background and provides smooth continuous scrolling of stars and nebulas.
 */
class BackgroundScroller {
    constructor() {
        this._objects = {}
    }

    add(filepath, speed) {
        let image = new Image()
        image.src = filepath

        this._objects[filepath] = {
            image: image,
            speed: speed,
            currentPosition: 0,
        }

        return this
    }

    update() {
        Object.values(this._objects).forEach(function (obj) {
            obj.currentPosition += obj.speed

            if (obj.currentPosition >= obj.image.height)
                obj.currentPosition = 0
        })
    }

    render(ctx) {
        ctx.fillStyle = "#000000"
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

        Object.values(this._objects).forEach(function (obj) {
            ctx.drawImage(obj.image, 0, obj.currentPosition)
            ctx.drawImage(obj.image, 0, obj.currentPosition - obj.image.height)
        })
    }
}

export const game = new Game();
game.load()
window.addEventListener('resize', game.onResize)
