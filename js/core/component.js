import Signal from "./signal.js";

/**
 * Base class for all components.
 */
export default class Component {
    /**
     *
     * @param name {String} this Component's name
     * @param owner {BaseEntity} owner of this Component. Will be automatically set by ComponentManager if not
     * specified.
     */
    constructor(name, owner = null) {
        this.name = name

        // Will be set by ComponentManager
        this.owner = owner

        this.isActive = true
        this.onDestroy = new Signal()
    }

    preUpdate() {
    }

    update() {
    }

    postUpdate() {
    }

    /**
     * <p>Render this Component.
     * <p>Called before Component's owner render().
     *
     * @param ctx {CanvasRenderingContext2D} canvas context where this Component should be rendered.
     */
    preRender(ctx) {
    }

    /**
     * <p>Render this Component.
     * <p>Called after Component's owner render().
     *
     * @param ctx {CanvasRenderingContext2D} canvas context where this Component should be rendered.
     */
    postRender(ctx) {
    }

    /**
     * Destroy this component.
     */
    destroy() {
        this.isActive = false
        this.owner.components.removeComponent(this)
        this.onDestroy.dispatch()
    }
}
