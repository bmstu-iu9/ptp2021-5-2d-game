import {BaseEnemy} from "./entities/base_enemy.js";
import {Player} from "./player/player.js";
import {configureKeyWatchers} from "./player/keyboard_control.js";
import {loadAssets} from "./asset_manager.js";
import {Body} from "./physics/body.js";
import {ExplosionEffect} from "./effects/explosion.js";
import {applyCollisionRules} from "./physics/collisions.js";
import {ShootingEnemy} from "./entities/shooting_enemy.js";
import {STATE_DESTROYED} from "./game_constants.js";
import {Vector} from "./math/vector.js";
import {Point} from "./math/point.js";
import {EnemyHauntingBullet} from "./entities/enemy_bullets.js";

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
        document.getElementById("container").insertBefore(this.viewport, null);
        this.playArea = new Body(new Point(0, 0), this.viewport.width, this.viewport.height)

        this.context = this.viewport.getContext('2d');

        // Load background
        this.bgImg = new Image()
        this.bgImg.src = 'assets/img/bg.jpg';

        this.gameObjects = []
        this.assets = {}

        return this
    }

    /**Prepares game for run, loads assets.
     * No entity should be created before the loading is complete!
     * Should be used to start the game.*/
    load() {
        configureKeyWatchers()
        this.assets = loadAssets(game.run)
    }

    /**Starts the game.
     * Should be called by load(). */
    run() {
        game.lastTimestamp = Date.now()
        window.requestAnimationFrame(game.gameLoop)
    }

    /**Main loop
     *
     * @param ts timestamp passed by requestAnimationFrame()
     */
    gameLoop(ts) {
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
                    this.gameObjects.push(new ExplosionEffect(this.gameObjects[i].body, this.assets["explosionOrange"]))
                } else if (this.gameObjects[i] instanceof EnemyHauntingBullet) {
                    this.gameObjects.push(new ExplosionEffect(this.gameObjects[i].body, this.assets["explosionPurple"]))
                }
                this.gameObjects.splice(i, 1)
            }
        }

        // TODO: SPAWNER DEBUG ONLY
        if (rnd(0, 100) > 98) {
            let pos = new Point(rnd(1, this.viewport.width - 50)),
                speed = new Vector(0, rnd(1, 4));
            this.gameObjects.push(new BaseEnemy(new Body(pos, 50, 55, speed), null, 15))
        }
        if (rnd(0, 200) > 198) {
            let pos = new Point(rnd(1, this.viewport.width - 50), 100),
                speed = new Vector(rnd(1, 4), 0)
            this.gameObjects.push(new ShootingEnemy(new Body(pos, 50, 55, speed), null, 15))
        }
    }

    /**Draws background and calls render() for every entity
     *
     */
    render() {
        // Draw background
        this.context.drawImage(this.bgImg, 0, 0, this.viewport.width, this.viewport.height)

        // Render all gameObjects
        for (let ent of this.gameObjects) {
            ent.render(this.context)
        }
    }
}

export const game = new Game();
game.load()
let player = new Player()
game.gameObjects.push(player)
game.player = player

