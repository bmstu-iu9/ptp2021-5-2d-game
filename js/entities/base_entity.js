import {game} from "../game.js";

export {BaseEntity}

/** Base class for every entity in the game.
 * Provides some basic logic: movement, bouncing,
 * destruction, and simple sprite rendering. */
class BaseEntity {
    constructor(body, dx = 0, dy = 0, sprite = null) {
        this.body = body
        this.dx = dx
        this.dy = dy
        this.sprite = sprite || game.assets["dummy"]
        this.state = game.constants.STATE_ACTIVE
    }

    /** This function is executed before <update> code.
     * Put your code here, not in BaseEntity.update */
    preUpdate() {
    }

    /** Contains entity's movement logic.
     * This method should change dx and dy for specific movement patterns. */
    calculateMovement() {
        if (this.body.posX + this.dx < 0 || this.body.posX + this.dx > game.viewport.width) {
            this.dx = -this.dx
        }
    }

    /** Updates entity's inner state.
     * You should not override this method. */
    update() {
        this.preUpdate();

        // Here movement goes
        this.calculateMovement()
        // TODO: Think about correcting for time elapsed (* game.timeElapsed / 16)
        let dx = this.dx, //
            dy = this.dy;

        if (this.body.posX + dx < 0 ||
            this.body.posY + dy < 0 ||
            this.body.posX + dx > game.viewport.width ||
            this.body.posY + dy > game.viewport.height) {
            this.destroy()
        }

        this.body.posX += dx;
        this.body.posY += dy;
    }

    /** Renders entity on canvas. */
    render(ctx) {
        ctx.drawImage(this.sprite, this.body.posX, this.body.posY, this.body.width, this.body.height)
    }

    /** Changes entity's state to "destroyed".
     * Engine will render destruction animation if present
     * and then remove object from game.
     * You should not override this method. */
    destroy() {
        this.state = game.constants.STATE_DESTROYED
    }
}