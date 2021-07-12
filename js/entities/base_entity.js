import {STATE_ACTIVE, STATE_DESTROYED} from "../core/game_constants.js";
import {SPRITE_SHEET} from "../textures/texture_atlas.js";
import {AnimationManager} from "../components/animation_manager.js";
import ComponentManager from "../core/component_manager.js";

export {BaseEntity}

/**Base class for every entity in the game.
 * Provides some basic logic.
 */
class BaseEntity {
    /**
     *
     * @param body Body representing physical position and properties
     * @param atlas SingleImage or SpriteSheet
     */
    constructor(body, atlas) {
        this.body = body

        this.components = new ComponentManager(this)

        this.atlas = atlas
        this.cellIndex = this.atlas.cellIndex

        this.animationManager = null
        if (this.atlas.type === SPRITE_SHEET)
            this.animationManager = this.components.add(new AnimationManager(this))

        this.state = STATE_ACTIVE
    }

    /**Updates entity's inner state.
     * You should not override this method. */
    update() {
        this.components.preUpdate()
        this.components.update()
        this.components.postUpdate()
    }

    /**Draws entity's atlas by default. If you want custom
     * rendering, override this method.
     *
     * @param ctx canvas context passed by render()
     */
    draw(ctx) {
        let cell = this.atlas.cells[this.cellIndex]
        ctx.drawImage(this.atlas.image, cell.x, cell.y, cell.w, cell.h, this.body.pos.x, this.body.pos.y,
            this.body.width, this.body.height)
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