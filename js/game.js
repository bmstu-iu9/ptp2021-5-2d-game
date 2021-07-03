import {BaseEnemy} from "./entities/base_enemy.js";
import {Player} from "./player/player.js";
import {configureKeyWatchers} from "./player/keyboard_control.js";
import * as constants from "./game_constants.js";
import {loadAssets} from "./asset_manager.js";
import {Body} from "./physics/body.js";
import {ExplosionEffect} from "./effect/explosion.js";
import {testCollision} from "./physics/collisions.js";

function rnd(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

class Game {
    lastTimestamp
    timeElapsed

    constructor() {
        // Create canvas and extract its context
        this.viewport = document.createElement('canvas');
        this.viewport.id = "gameViewport";
        this.viewport.width = window.innerWidth;
        this.viewport.height = window.innerHeight;
        document.getElementById("container").insertBefore(this.viewport, null);

        this.context = this.viewport.getContext('2d');

        this.constants = constants;

        // Load background
        // TODO: Use sprite manager to load background and sprites
        this.bgImg = new Image()
        this.bgImg.src = 'assets/img/bg.jpg';

        this.gameObjects = []
        this.assets = {}

        return this
    }

    /** Prepares game for running, loads assets.
     * No entity should be created before the loading is complete!
     * Should be used to start the game.*/
    load() {
        configureKeyWatchers()
        this.assets = loadAssets(game.run)
    }

    /** Starts the game.
     * Should not be called directly. */
    run() {
        game.lastTimestamp = Date.now()
        window.requestAnimationFrame(game.gameLoop)
    }

    /** Main loop */
    gameLoop(ts) {
        game.update(ts);
        game.render()
        window.requestAnimationFrame(game.gameLoop)
    }

    processCollisions() {
        for (let i = 0; i < this.gameObjects.length; i++) {
            if (!this.gameObjects[i].body.canCollide) continue

            for (let j = i + 1; j < this.gameObjects.length; j++) {
                if (this.gameObjects[i].body.collidesWith(this.gameObjects[j].body)) {
                    testCollision(this.gameObjects[i], this.gameObjects[j])
                }
            }
        }
    }

    /** Updates every entity in the game */
    update(ts) {
        this.timeElapsed = ts - this.lastTimestamp;
        this.lastTimestamp = ts

        for (let i = 0; i < this.gameObjects.length; i++) {
            this.gameObjects[i].update()
        }

        this.processCollisions()

        for (let i = 0; i < this.gameObjects.length; i++) {
            if (this.gameObjects[i].state === game.constants.STATE_DESTROYED) {
                if (this.gameObjects[i] instanceof BaseEnemy) {
                    this.gameObjects.push(new ExplosionEffect(this.gameObjects[i].body, this.assets["explosionOrange"]))
                }
                this.gameObjects.splice(i, 1)
            }
        }

        // TODO: SPAWNER DEBUG ONLY
        if (rnd(0, 100) > 97) {
            this.gameObjects.push(new BaseEnemy(new Body(rnd(1, this.viewport.width - 50), 0, 50, 55),
                0, rnd(1, 4), null, 15))
        }
    }

    /** Draws background and calls render() for every entity */
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
game.gameObjects.push(new Player())

