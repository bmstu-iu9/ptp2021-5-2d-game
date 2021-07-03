import {game} from "../game.js";
import {STATE_ACTIVE, STATE_DESTROYED} from "../game_constants.js";

export {BaseEntity}

/** Base class for every entity in the game.
 * Provides some basic logic: movement, bouncing,
 * destruction, and simple sprite rendering.
 *
 * @param body <Body> representing entity's physical properties
 * @param dx constant oX speed
 * @param dy constant oY speed
 * @param sprite sprite to be rendered. If no specified then default will be used */
class BaseEntity {
    constructor(body, dx = 0, dy = 0, sprite = null) {
        this.body = body
        this.dx = dx
        this.dy = dy
        this.sprite = sprite || game.assets["dummy"]
        this.state = STATE_ACTIVE
    }

    /** This function is executed before <update> code.
     * Put your code here, not in BaseEntity.update */
    preUpdate() {
    }

    /**Contains entity's movement logic.
     * Override this method to change dx and dy
     * for specific movement patterns.
     */
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

    /** Performs drawing of the entity by default. If you want custom
     * rendering, override this method.
     * @param ctx canvas context passed by render()
     */
    draw(ctx) {
        ctx.drawImage(this.sprite, this.body.posX, this.body.posY, this.body.width, this.body.height)
    }

    /**Renders entity on canvas.
     * You should not override this method.
     * Modify draw() instead.
     * @param ctx canvas context passed by engine
     */
    render(ctx) {

        // Rotate the canvas according to the body.rotation, draw and then restore the canvas.
        ctx.save()
        ctx.translate(this.body.centerX, this.body.centerY)
        ctx.rotate(this.body.rotation)
        ctx.translate(-this.body.centerX, -this.body.centerY)
        this.draw(ctx)
        ctx.restore()
    }

    /**Changes entity's state to "destroyed".
     * Engine will render destruction animation if present
     * and then remove object from game.
     * You should not override this method. */
    destroy() {
        this.state = STATE_DESTROYED
    }
}