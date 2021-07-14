import {BaseEnemy} from "../entities/base_enemy.js";
import {Player} from "../player/player.js";
import {configureKeyWatchers} from "../player/keyboard_control.js";
import AssetManager from "./asset_manager.js";
import {Body} from "../physics/body.js";
import {applyCollisionRules} from "../physics/collisions.js";
import {ShootingEnemy} from "../entities/shooting_enemy.js";
import {ENTITY_STATE, GAME_STATE} from "./enums.js";
import {Vector} from "../math/vector.js";
import {EnemyHauntingBullet} from "../entities/enemy_bullets.js";
import {switchToMenu} from "./page.js";
import {ExplosionEffect} from "../entities/effects.js";
import {ConstantSpeed} from "../components/movement_logic.js";
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
        this.viewport = document.getElementById("gameViewport");
        this.viewport.width = window.innerWidth
        this.viewport.height = window.innerHeight
        this.context = this.viewport.getContext('2d');
        document.getElementById("container").insertBefore(this.viewport, null);

        this.playArea = new Body(new Vector(0, 0), window.innerWidth, window.innerHeight)

        this.lastHBarWidth = 260
        this.backgroundObjects = new BackgroundScroller()
            //.add('assets/img/bg.jpg', 0.5)
            .add('assets/img/stars1.png', 0.5)
            .add('assets/img/stars2.png', 1)
            .add('assets/img/nebula.png', 1)

        this.gameObjects = []

        this.state = GAME_STATE.LOADING

        this.isPressed = {}

        return this
    }

    load() {
        this.assets = new AssetManager(this, this.onLoaded)
        configureKeyWatchers()
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
        this.levelManager = new LevelManager(0)
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

        this.backgroundObjects.update()

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
            if (this.gameObjects[i].state === ENTITY_STATE.DESTROYED) {
                if (this.gameObjects[i] instanceof BaseEnemy) {
                    this.gameObjects.push(
                        new ExplosionEffect(this.gameObjects[i].body, this.assets.textures["explosion_orange"]))
                    this.levelManager.enemiesKilled++
                } else if (this.gameObjects[i] instanceof EnemyHauntingBullet) {
                    this.gameObjects.push(
                        new ExplosionEffect(this.gameObjects[i].body, this.assets.textures["explosion_purple"]))
                }
                this.gameObjects.splice(i, 1)
            }
        }
        game.levelManager.update();
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

        //Draw HP-bar
        this.context.drawImage(game.assets.textures["player_hp_bar_back"].image, 20, 20, 274, 36)

        let barW = 260 * this.player.health / 100,
            diff = barW - this.lastHBarWidth
        if (diff !== 0) {
            barW = this.lastHBarWidth + diff * 0.1;
            this.lastHBarWidth = barW
        }

        this.context.drawImage(game.assets.textures["player_hp_bar"].image, 0, 0, barW, 20, 27, 28, barW, 20)

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
        'waves': [
            [
                ['BaseEnemy', 5],
                ['ShootingEnemy', 5]
            ],
            [
                ['ShootingEnemy', 5]
            ]
        ],
        'boss': null,
        'boostersFrequency': 100,
        'allowedBooster': ['heal', 'laser'],
        'pointsReward': 666,
    },

]

class LevelManager{
    constructor(index) {
        this.currentLevelIndex = index
        this.currentLevel = GAME_LEVELS[index]
        this.currentWave = 0
        this.enemiesWaveNum = 0
        this.enemiesKilled = 0
        this.availableEnemies = []
        for (let [name, amount] of this.currentLevel.waves[this.currentWave]) {
            this.enemiesWaveNum += amount
            switch (name) {
                case 'BaseEnemy':
                    for (let i = 0; i < amount; i++) {
                        let body = new Body(new Vector(rnd(30, game.playArea.width), 0), 50, 50),
                            enemy = new BaseEnemy(body, game.assets.textures["enemy_ship"], 10)
                        enemy.movementLogic = enemy.components.add(new ConstantSpeed(new Vector(0, rnd(1, 6))))
                        this.availableEnemies.push(enemy)
                    }
                    break
                case 'ShootingEnemy':
                    for (let i = 0; i < amount; i++) {
                        let body = new Body(new Vector(rnd(30, game.playArea.width), rnd(100, 400)), 50, 50)
                        this.availableEnemies.push(new ShootingEnemy(body, game.assets.textures["enemy_ship"], 15, 10))
                    }
                    break
            }
        }
    }

    enterLevel(index){
        this.currentLevel = index
    }

    update(){
        if (this.enemiesKilled === this.enemiesWaveNum) {
            this.displayCongratulations()
        }
        if (this.availableEnemies.length > 0 && rnd(1, 100) > 95) {
            game.gameObjects.push(this.availableEnemies.shift())
        }
    }

    displayCongratulations(){
        setTimeout(function(){
            game.player.destroy();
        },1000);
        // Write "LEVEL CLEARED"
        // Веселая музыка
    }



}

export const game = new Game();
game.load()
window.addEventListener('resize', game.onResize)
