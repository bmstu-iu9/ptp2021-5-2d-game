import {ENTITY_STATE} from "../core/enums.js";
import AnimationManager from "../components/animation_manager.js";
import ComponentManager from "../core/component_manager.js";
import Signal from "../core/signal.js";
import AssetsManager from "../core/assets_manager.js";
import TextureAtlas from "../textures/texture_atlas.js";
import Chance from "../util/chance.js";
import Shared from "../util/shared.js";

/**
 * <p>Base class for every Entity in the game.
 * Provides some basic logic.
 *
 * <p><b>Should not be instantiated directly.</b></p>
 */
export default class BaseEntity {
    /**
     *
     * @param body {Body} Body representing physical position and properties. If Body's position is Vector(0, 0), it
     * is assumed that Entity wants to be spawned at random point and slowly enter the screen.
     * @param atlasName {String} name of atlas loaded into AssetsManager
     */
    constructor(body, atlasName) {
        this.body = body

        if (this.body.pos.x === 0 && this.body.pos.y === 0) {
            this.body.pos.y = -this.body.height
            this.body.pos.x = Chance.randomRange(0, Shared.gameWidth - this.body.width)
        }

        this.components = new ComponentManager(this)
        this.onDestroyed = new Signal()

        this.atlas = AssetsManager.textures[atlasName]
        this.cellIndex = this.atlas.cellIndex
        this._opacity = 1

        this.animationManager = null
        if (this.atlas.type === TextureAtlas.SPRITE_SHEET)
            this.animationManager = this.components.add(new AnimationManager(this))

        this.state = ENTITY_STATE.ACTIVE
    }

    /**
     * Effect to be played when this Entity is destroyed.
     * <br>If you want your Entity to die without destruction effect, return null here.
     *
     * @example Play "explosion_orange" effect for 500ms
     * get destructionEffect() {
     *   return new ExplosionEffect(this, "explosion_orange", 500, 2)
     * }
     *
     * @returns {null|BaseEffect}
     */
    get destructionEffect() {
        return null
    }

    /**
     * The name of the sound that should be played when this Entity is destroyed.
     *
     * @return {null|string}
     */
    get destructionSoundName() {
        return null
    }

    /**
     * The opacity of this object.
     *
     * @return {number} opacity of this object ranging from 0 to 1 (inclusive).
     */
    get opacity() {
        return this._opacity
    }

    /**
     * Set the opacity of this object.
     *
     * @param v {Number} desired opacity value. Should range from 0 to 1 (inclusive).
     */
    set opacity(v) {
        let opacityValue = v

        if (opacityValue > 1 - Number.EPSILON)
            opacityValue = 1
        else if (opacityValue < Number.EPSILON)
            opacityValue = 0

        this._opacity = opacityValue
    }

    /**Updates entity's inner state.
     * You should not override this method. */
    update() {
        this.components.preUpdate()
        this.components.update()
        this.components.postUpdate()
    }

    /**
     * Draws Entity's atlas by default.
     * <p>If you want custom drawing, override this method.
     *
     * @param ctx canvas context passed by render()
     */
    draw(ctx) {
        let cell = this.atlas.cells[this.cellIndex]
        ctx.drawImage(this.atlas.image, cell.x, cell.y, cell.w, cell.h, this.body.pos.x, this.body.pos.y,
            this.body.width, this.body.height)
    }

    /**
     * <p>Renders entity on canvas. This method handles opacity, rotationSpeed and other properties.
     * <p>You **should not** override this method.
     * Override draw() instead.
     *
     * @param ctx {CanvasRenderingContext2D} canvas context passed by Game.render()
     */
    render(ctx) {
        ctx.save()

        ctx.globalAlpha = this.opacity

        if (this.body.rotation !== 0) {
            ctx.translate(this.body.centerX, this.body.centerY)
            ctx.rotate(this.body.rotation)
            ctx.translate(-this.body.centerX, -this.body.centerY)
        }

        this.components.preRender(ctx)
        this.draw(ctx)
        this.components.postRender(ctx)

        ctx.restore()
    }

    /**
     * Changes entity's state to "destroyed". Game will render destruction animation if present
     * and then remove object from game.
     *
     * <p>You should not override this method.
     */
    destroy() {
        this.state = ENTITY_STATE.DESTROYED
        this.onDestroyed.dispatch()
    }
}
