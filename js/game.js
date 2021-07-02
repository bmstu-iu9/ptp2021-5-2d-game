import {BaseEnemy} from "./entities/base_enemy.js";
import {Player} from "./player/player.js";
import {configureKeyWatchers} from "./player/keyboard_control.js";
import * as constants from "./gameConstants.js";

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

        return this
    }

    /** Starts game */
    run() {
        configureKeyWatchers()
        window.requestAnimationFrame(this.gameLoop)
    }

    /** Main loop */
    gameLoop() {
        game.update();
        game.render()
        window.requestAnimationFrame(game.gameLoop)
    }

    /** Updates every entity in the game */
    update() {
        for (let ent of this.entites) {
            ent.update()
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
game.entites.push(new BaseEnemy(400, 200, 4, 0, 20, 20))
game.entites.push(new Player())
game.run()

