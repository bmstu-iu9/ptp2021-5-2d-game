import {BaseEnemy} from "../entities/base_enemy.js";
import {Player} from "../player/player.js";
import {configureKeyWatchers} from "../player/keyboard_control.js";
import {loadAssets} from "./asset_manager.js";
import {Body} from "../physics/body.js";
import {ExplosionEffect} from "../effects/explosion.js";
import {applyCollisionRules} from "../physics/collisions.js";
import {ShootingEnemy} from "../entities/shooting_enemy.js";
import {PLAYER_HEALTH, STATE_DESTROYED} from "./game_constants.js";
import {Vector} from "../math/vector.js";
import {Point} from "../math/point.js";
import {EnemyHauntingBullet} from "../entities/enemy_bullets.js";
import {EventManager} from "./event_manager.js";
import {switchToMenu} from "./page.js";
import {GAME_STATE} from "./enums.js";
import {BaseBooster} from "../entities/base_booster.js";

function rnd(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}


class Game {
    lastTimestamp
    timeElapsed
    player

    constructor() {
        // Create canvas and extract its context
        this.viewport = document.createElement('canvas');
        this.viewport.id = "gameViewport";
        this.viewport.width = window.innerWidth;
        this.viewport.height = window.innerHeight;
        this.context = this.viewport.getContext('2d');
        document.getElementById("container").insertBefore(this.viewport, null);

        //
        this.playArea = new Body(new Point(0, 0), window.innerWidth, window.innerHeight)

        // Load background
        this.bgImg = new Image()
        this.bgImg.src = 'assets/img/bg.jpg';

        this.gameObjects = []
        this.assets = {}
        this.isPressed = {}
        this.eventManager = new EventManager()
        this.state = GAME_STATE.LOADING

        return this
    }

    /**Prepares game for start, loads assets.
     * No entity should be created before the loading is complete!
     */
    load() {
        configureKeyWatchers()
        game.assets = loadAssets(game.onLoaded)
    }

    /**Callback for load().
     * Shows the game menu.
     */
    onLoaded() {
        game.state = GAME_STATE.MENU
        switchToMenu()
    }

    /**Reset the game & switch to main menu.
     * Replaces gameover() for now.
     */
    reset() {
        this.gameObjects = []
        this.state = GAME_STATE.MENU
        switchToMenu()
    }

    /**Starts the game.
     *
     */
    start() {
        game.lastTimestamp = Date.now()

        game.player = new Player()
        game.gameObjects.push(game.player)

        game.state = GAME_STATE.RUNNING

        window.requestAnimationFrame(game.gameLoop)
    }

    /**Main loop
     *
     * @param ts timestamp passed by requestAnimationFrame()
     */
    gameLoop(ts) {
        if (game.state !== GAME_STATE.RUNNING)
            return

        game.update(ts);
        game.render()
        window.requestAnimationFrame(game.gameLoop)
    }

    /**Updates every entity in the game.
     *
     * @param ts timestamp passed by requestAnimationFrame()
     */
    update(ts) {
        this.timeElapsed = ts - this.lastTimestamp;
        this.lastTimestamp = ts

        // Update cycle
        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update()
        }

        // Process collisions
        for (let i = 0; i < this.gameObjects.length; i++) {
            if (!this.gameObjects[i].body.canCollide) continue

            for (let j = i + 1; j < this.gameObjects.length; j++) {
                if (this.gameObjects[i].body.collidesWith(this.gameObjects[j].body)) {
                    applyCollisionRules(this.gameObjects[i], this.gameObjects[j])
                }
            }
        }

        // Destroy entities which left the screen
        for (let obj of this.gameObjects) {
            if (!obj.body.collidesWith(this.playArea)) {
                obj.destroy()
            }
        }

        // Process destroyed objects
        for (let i = 0; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i].state === STATE_DESTROYED) {
                if (this.gameObjects[i] instanceof BaseEnemy) {
                    this.gameObjects.push(
                        new ExplosionEffect(this.gameObjects[i].body, this.assets["explosion_orange"]))
                } else if (this.gameObjects[i] instanceof EnemyHauntingBullet) {
                    this.gameObjects.push(
                        new ExplosionEffect(this.gameObjects[i].body, this.assets["explosion_purple"]))
                }
                this.gameObjects.splice(i, 1)
            }
        }

        // TODO: SPAWNER DEBUG ONLY
        if (rnd(0, 100) > 98) {
            let pos = new Point(rnd(1, this.playArea.width - 50)),
                speed = new Vector(0, rnd(1, 4));
            this.gameObjects.push(new BaseEnemy(new Body(pos, 50, 55, speed), game.assets["enemy_ship"], 15))
        }
        if (rnd(0, 200) > 198) {
            let pos = new Point(rnd(1, this.playArea.width - 50), 100),
                speed = new Vector(rnd(1, 4), 0)
            this.gameObjects.push(new ShootingEnemy(new Body(pos, 50, 55, speed), game.assets["enemy_ship"], 25))
        }
        if (rnd(0, 1000) > 998) {
            let pos = new Point(rnd(1, this.playArea.width - 50)),
                speed = new Vector(0, 2);
            this.gameObjects.push(new BaseBooster(new Body(pos, 40, 45, speed), game.assets["heal_orb"], "heal_boost"))
        }
    }

    /**Draws background and calls render() for every entity
     *
     */
    render() {
        // Draw background
        this.context.drawImage(this.bgImg, 0, 0, this.playArea.width, this.playArea.height)

        // Render all gameObjects
        for (let ent of this.gameObjects) {
            ent.render(this.context)
        }

        //Draw HP-bar
        this.context.drawImage(game.assets["player_hp_bar_back"], 20, 20, 274, 36)

        let smooth_coeff = 0.3
        this.player.healthbar += smooth_coeff*(this.player.health/PLAYER_HEALTH - this.player.healthbar)

        let barW = 260 * this.player.healthbar
        this.context.drawImage(game.assets["player_hp_bar"], 0, 0, barW, 20, 27, 28, barW, 20)

    }

    onResize() {
        let ww = window.innerWidth, wh = window.innerHeight

        game.viewport.style.width = ww.toString()
        game.viewport.style.height = wh.toString()

        game.playArea.width = ww
        game.playArea.height = wh
    }
}

export const game = new Game();
game.load()
window.addEventListener('resize', game.onResize)
