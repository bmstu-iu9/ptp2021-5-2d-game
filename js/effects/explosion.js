import {BaseEffect} from "./base_effect.js";

export {ExplosionEffect}

/**Simple explosion effect. */
class ExplosionEffect extends BaseEffect {
    /**
     *
     * @param body Body representing Effect's position and properties. Will be copied!
     * @param sprite a series of 100x100 textures packed in a single image
     */
    constructor(body, sprite) {
        super(body, sprite);
        this.body.width = this.body.height = Math.min(this.body.width, this.body.height)
        this.body.scale(2) // explosion actually grows, so we need space for it
    }
}