import {BaseEnemy} from "../entities/base_enemy.js";
import {Player} from "../player/player.js";
import {configureKeyWatchers} from "../player/keyboard_control.js";
import AssetsManager from "./assets_manager.js";
import Body from "../physics/body.js";
import {applyCollisionRules} from "../physics/collisions.js";
import {ShootingEnemy} from "../entities/shooting_enemy.js";
import {LaserEnemy} from "../entities/laser_enemy.js";
import {ENTITY_STATE, WEAPON_TYPE} from "./enums.js";
import Vector from "../math/vector.js";
import {switchToMenu} from "./page.js";
import {ConstantSpeed} from "../components/movement_logic.js";
import {BaseBooster} from "../entities/base_booster.js";
import {PlayerOrbitalShield} from "../entities/player_bullets.js";
import {BaseBoss} from "../entities/base_boss.js";
import Clock from "./clock.js";
import {SpinningBoss} from "../entities/spinning_boss.js";
import SoundManager from "./sound_manager.js";

function rnd(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
    if (width < 2 * radius) radius = width / 2;
    if (height < 2 * radius) radius = height / 2;
    this.beginPath();
    this.moveTo(x + radius, y);
    this.arcTo(x + width, y, x + width, y + height, radius);
    this.arcTo(x + width, y + height, x, y + height, radius);
    this.arcTo(x, y + height, x, y, radius);
    this.arcTo(x, y, x + width, y, radius);
    this.closePath();
    return this;
}

class Game {
    static STATE_LOADING = 0
    static STATE_MENU = 1
    static STATE_RUNNING = 2
    static STATE_BETWEEN_LEVELS = 3
    static STATE_END = 4

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

        this.playArea = new Body(new Vector(0, 0), window.innerWidth, window.innerHeight)

        this.lastHBarWidth = 260
        this.backgroundObjects = new BackgroundScroller()
            //.add('assets/img/bg.jpg', 0.5)
            .add('assets/img/stars1.png', 0.5)
            .add('assets/img/stars2.png', 1)
            .add('assets/img/nebula.png', 1)

        this.gameObjects = []

        this.state = Game.STATE_LOADING

        this.isPressed = {}

        this.scoreDisplayed = 0
    }

    load() {
        configureKeyWatchers()
        AssetsManager.loadAssets(this.onLoaded)
    }

    /**
     * Callback for load().
     * Shows the game menu.
     */
    onLoaded() {
        game.state = Game.STATE_MENU
        switchToMenu()
    }

    gameover() {
        this.state = Game.STATE_END
        setTimeout(function () {
            game.reset()
        }, 5000)
    }

    /**
     * Reset the game & switch to main menu.
     */
    reset() {
        this.gameObjects = []
        this.state = Game.STATE_MENU
        switchToMenu()
    }

    /**
     * Start the game.
     */
    start() {
        if (this.state !== Game.STATE_MENU)
            return

        game.player = new Player()
        game.gameObjects.push(game.player)

        this.levelManager = new LevelManager(0)

        game.state = Game.STATE_RUNNING

        window.requestAnimationFrame(game.gameLoop)
    }

    /**
     * Main loop
     *
     * @param ts timestamp passed by requestAnimationFrame()
     */
    gameLoop(ts) {
        if (game.state === Game.STATE_LOADING || game.state === Game.STATE_MENU)
            return

        game.update(ts)
        game.render()
        window.requestAnimationFrame(game.gameLoop)
    }

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
                obj.destroy()
        }

        this.processCollisions()

        // Process destroyed objects
        for (let i = 0; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i].state === ENTITY_STATE.DESTROYED) {
                let destructionEffect = this.gameObjects[i].destructionEffect
                let destructionSoundName = this.gameObjects[i].destructionSoundName

                if (destructionEffect !== null)
                    this.gameObjects.push(destructionEffect)

                if (destructionSoundName !== null) {
                    SoundManager.gameSounds(destructionSoundName)
                }

                if (this.gameObjects[i] instanceof BaseEnemy) {
                    this.levelManager.enemiesKilled++
                    this.levelManager.score += this.gameObjects[i].reward
                }

                this.gameObjects.splice(i, 1)
            }
        }

        if (game.state === Game.STATE_RUNNING)
            game.levelManager.update()
    }

    /**Draws background and calls render() for every entity
     *
     */
    render() {
        this.backgroundObjects.render(this.context)

        // Render all gameObjects
        for (let ent of this.gameObjects) {
            ent.render(this.context)
        }

        // Draw score counter
        if (this.state !== Game.STATE_END) {
            if (this.scoreDisplayed !== this.levelManager.score) {
                this.scoreDisplayed += Math.min(5, this.levelManager.score - this.scoreDisplayed)
            }
            this.context.fillStyle = "orange";
            this.context.fillText("Total score: " + this.scoreDisplayed, this.viewport.width - 200, 80)
        }

        // Draw HP-bar
        this.context.drawImage(AssetsManager.textures["player_hp_bar_back"].image, 20, 20, 274, 36)

        let barW = 260 * this.player.health / 100,
            diff = barW - this.lastHBarWidth
        if (diff !== 0) {
            barW = this.lastHBarWidth + diff * 0.1;
            this.lastHBarWidth = barW
        }

        this.context.drawImage(AssetsManager.textures["player_hp_bar"].image, 0, 0, 260, 20, 27, 28, barW, 20)

        if (this.state === Game.STATE_BETWEEN_LEVELS || this.state === Game.STATE_END) {
            let textX = this.viewport.width / 2,
                textY = this.viewport.height / 2;

            if (this.state === Game.STATE_BETWEEN_LEVELS) {
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

    onResize() {
        let ww = window.innerWidth, wh = window.innerHeight

        game.viewport.style.width = ww.toString()
        game.viewport.style.height = wh.toString()

        game.playArea.width = ww
        game.playArea.height = wh
    }
}

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

const GAME_LEVELS = [
    {
        'waves': [],
        'default_weapon': WEAPON_TYPE.REGULAR,
        'boss': 'SpinningBoss',
        'boostersFrequency': 300,
        'allowedBooster': ['heal', 'laser', 'shield'],
    },

    {
        'waves': [
            [
                ['BaseEnemy', 5]
            ],
            [
                ['ShootingEnemy', 10]
            ]
        ],
        'default_weapon': WEAPON_TYPE.MULTI,
        'boss': null,
        'boostersFrequency': 300,
        'allowedBooster': ['heal', 'laser', 'shield'],
    },

    {
        'waves': [
            [
                ['BaseEnemy', 5]
            ],
            [
                ['ShootingEnemy', 15]
            ]
        ],
        'default_weapon': WEAPON_TYPE.LASER,
        'boss': null,
        'boostersFrequency': 300,
        'allowedBooster': ['heal', 'laser', 'shield'],
    },

    {
        'waves': [
            [
                ['BaseEnemy', 30]
            ]
        ],
        'default_weapon': WEAPON_TYPE.MULTI,
        'boss': null,
        'boostersFrequency': 300,
        'allowedBooster': ['heal', 'laser', 'shield'],
    },

]

class LevelManager {
    constructor(index) {
        this.currentLevelIndex = index
        this.currentLevel = GAME_LEVELS[index]
        this.framesTillNextBooster = this.currentLevel.boostersFrequency
        this.score = 0;
        this.currentWave = 0
        this.enemiesTotalNum = 0
        this.bossPushed = false
        this.enemiesKilled = 0
        this.availableEnemies = []
        game.player.changeWeapon(GAME_LEVELS[this.currentLevelIndex].default_weapon, true)

    }


    update() {

        // Push enemies from waves
        if (this.availableEnemies.length === 0 && this.currentWave < this.currentLevel.waves.length) {
            for (let [name, amount] of this.currentLevel.waves[this.currentWave]) {
                this.enemiesTotalNum += amount
                switch (name) {
                    case 'BaseEnemy':
                        for (let i = 0; i < amount; i++) {
                            let body = new Body(new Vector(rnd(30, game.playArea.width), 0), 50, 50),
                                enemy = new BaseEnemy(body, "enemy_ship", 10)
                            enemy.movementLogic = enemy.components.add(new ConstantSpeed(new Vector(0, rnd(1, 6))))
                            this.availableEnemies.push(enemy)
                        }
                        break
                    case 'ShootingEnemy':
                        for (let i = 0; i < amount; i++) {
                            let body = new Body(new Vector(rnd(30, game.playArea.width), rnd(100, 400)), 50, 50)
                            this.availableEnemies.push(
                                new ShootingEnemy(body, "enemy_ship", 15, 10))
                        }
                        break
                    case 'LaserEnemy':
                        for (let i = 0; i < amount; i++) {
                            let body = new Body(new Vector(rnd(30, game.playArea.width), rnd(60, 300)), 50, 50)
                            this.availableEnemies.push(
                                new LaserEnemy(body, "laser_enemy", 15, 10))
                        }
                        break
                }
            }

            this.currentWave++
        }

        // Push boss
        if (this.currentWave === this.currentLevel.waves.length && this.currentLevel.boss !== null && !this.bossPushed) {
            this.enemiesTotalNum++

            let body, boss

            switch (this.currentLevel.boss) {
                case 'BaseBoss':
                    body = new Body(new Vector(game.playArea.width / 2 - 100, 20), 200, 150)
                    boss = new BaseBoss(body, "base_boss", 200, 10)

                    this.availableEnemies.push(boss)

                    break
                case 'SpinningBoss':
                    body = new Body(new Vector(game.playArea.width / 2 - 125, 20), 200, 150)
                    boss = new SpinningBoss(body, "base_boss", 200, 10)

                    this.availableEnemies.push(boss)

                    break
            }

            this.bossPushed = true
        }


        // Push boosters
        if (this.framesTillNextBooster === 0 && game.state === Game.STATE_RUNNING) {
            let boostName = GAME_LEVELS[this.currentLevelIndex].allowedBooster[Math.floor(
                Math.random() * GAME_LEVELS[this.currentLevelIndex].allowedBooster.length)];
            let body = new Body(new Vector(rnd(30, game.playArea.width), 0), 50, 50)
            game.gameObjects.push(new BaseBooster(body, boostName + "_orb", boostName))
            this.framesTillNextBooster = this.currentLevel.boostersFrequency
        }
        this.framesTillNextBooster--


        // Going to the next level
        if (this.enemiesKilled === this.enemiesTotalNum) {
            if (this.currentLevelIndex + 1 < GAME_LEVELS.length)
                this.nextLevel()
            else
                game.gameover()
        }


        // Spawn enemies
        if (rnd(1, 100) > 95 && this.availableEnemies.length > 0 && game.state === Game.STATE_RUNNING) {
            game.gameObjects.push(this.availableEnemies.shift())
        }
    }

    nextLevel() {
        game.state = Game.STATE_BETWEEN_LEVELS
        this.currentLevel = GAME_LEVELS[++this.currentLevelIndex]
        this.currentWave = 0
        this.enemiesTotalNum = 0
        this.enemiesKilled = 0
        this.bossPushed = false
        game.player.changeWeapon(GAME_LEVELS[this.currentLevelIndex].default_weapon, true)
        setTimeout(function () {
            game.state = Game.STATE_RUNNING;
        }, 3000)
    }


}

export const game = new Game();
game.load()
window.addEventListener('resize', game.onResize)
