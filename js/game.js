import {BaseEnemy} from "./entities/base_enemy.js";
import {Player} from "./player/player.js";
import {configureKeyWatchers} from "./player/keyboard_control.js";
import * as constants from "./gameConstants.js";
import {loadAssets} from "./assetManager.js";

class Game {
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

        this.entites = []
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
        window.requestAnimationFrame(game.gameLoop)
    }

    /** Main loop */
    gameLoop() {
        game.update();
        game.render()
        window.requestAnimationFrame(game.gameLoop)
    }

    /** Updates every entity in the game */
    update() {
        for (let i = 0; i < this.entites.length; i++) {
            this.entites[i].update()

            if (this.entites[i] instanceof Player) {
                // check collision
            }

            if (this.entites[i].state === game.constants.STATE_DESTROYED) {
                this.entites.splice(i, 1)
            }
        }
    }

    /** Draws background and calls render() for every entity */
    render() {
        this.context.drawImage(this.bgImg, 0, 0, this.viewport.width, this.viewport.height)
        for (let ent of this.entites) {
            ent.render(this.context)
        }
    }
}

export const game = new Game();
game.load()
game.entites.push(new BaseEnemy(100, 100, 5, 0, 50, 55))
game.entites.push(new BaseEnemy(200, 200, 4, 0, 50, 55))
game.entites.push(new BaseEnemy(300, 300, 3, 0, 50, 55))
game.entites.push(new Player())

