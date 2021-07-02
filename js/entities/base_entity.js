import {game} from "../game.js";

export {BaseEntity}

/** Base class for every entity in the game.
 * Provides some basic logic: movement, bouncing,
 * destruction, and simple sprite rendering. */
class BaseEntity {
    constructor(posX, posY, dx, dy, width, height) {
        this.posX = posX;
        this.posY = posY;
        this.dx = dx;
        this.dy = dy;
        this.width = width;
        this.height = height;
    }

    /** Contains entity's movement logic.
     * This method should change dx and dy for specific movement patterns. */
    calculateMovement() {
        if (this.posX + this.dx < 0 || this.posX + this.dx > game.viewport.width) {
            this.dx = -this.dx
        }
        if (this.posY + this.dy < 0 || this.posY + this.dy > game.viewport.height) {
            this.destroy()
        }
    }

    get centerX() {
        return this.posX + this.width / 2
    }

    get centerY() {
        return this.posY + this.height / 2
    }

    /** Updates entity's inner state.
     * You should not override this method. */
    update() {
        this.calculateMovement()
        this.posX += this.dx;
        this.posY += this.dy;
    }

    /** Changes entity's state to "in destruction".
     * Engine will render destruction animation if present
     * and then remove object from game.
     * You should not override this method. */
    destroy() {
        console.log("I'm destroyed!")
    }

    /** Renders entity on canvas. */
    render(ctx) {
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(this.posX, this.posY, this.width, this.height);
    }

}