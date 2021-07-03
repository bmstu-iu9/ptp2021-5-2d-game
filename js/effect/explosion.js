import {BaseEffect} from "./base_effect.js";

export {ExplosionEffect}

/** Simple explosion effect */
class ExplosionEffect extends BaseEffect {
    constructor(body, sprite) {
        super(body, sprite);
        this.body.scale(2) // explosion actually grows, so we need space for it
    }
}