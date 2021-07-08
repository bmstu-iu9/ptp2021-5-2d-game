import {game} from "../core/game.js";
import {STATE_ACTIVE, STATE_DESTROYED} from "../core/game_constants.js";

export {BaseEntity}

/**Base class for every entity in the game.
 * Provides some basic logic: movement, bouncing,
 * destruction, and simple sprite rendering.
 */
class BaseEntity {
    /**
     *
     * @param body Body representing physical position and properties
     * @param sprite sprite to be rendered. If no specified then default will be used.
     */
    constructor(body, sprite = null) {
        this.body = body
        this.sprite = sprite || game.assets["dummy"]
        this.state = STATE_ACTIVE
    }

    /**This method is executed before update() code.
     * Put your code here, not in BaseEntity.update */
    preUpdate() {
    }

    /**Contains entity's movement logic.
     * Override this method to change dx and dy
     * for specific movement patterns.
     * Default: bounce off horizontal walls.*/
    calculateMovement() {
        let newPos = this.body.pos.clone().moveBy(this.body.speed)
        if (newPos.x < 0 || newPos.x + this.body.width > game.playArea.width) {
            this.body.speed.x = -this.body.speed.x
        }
    }

    /**Updates entity's inner state.
     * You should not override this method. */
    update() {
        this.preUpdate();
        // Here movement goes
        this.calculateMovement()
        // TODO: Think about correcting for time elapsed (* game.timeElapsed)
        this.body.pos.moveBy(this.body.speed)
    }

    /**Draws entity's sprite by default. If you want custom
     * rendering, override this method.
     *
     * @param ctx canvas context passed by render()
     */
    draw(ctx) {
        ctx.drawImage(this.sprite, this.body.pos.x, this.body.pos.y, this.body.width, this.body.height)
    }

    /**Renders entity on canvas.
     * You should not override this method.
     * Modify draw() instead.
     *
     * @param ctx canvas context passed by engine
     */
    render(ctx) {
        // Just draw if no rotation needed.
        if (this.body.rotation === 0) {
            this.draw(ctx)
            return
        }
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