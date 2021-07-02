import {BaseEffect} from "./base_effect";

export {ExplosionEffect}

class ExplosionEffect extends BaseEffect {
    constructor(body, sprite) {
        super(body, sprite);
        this.body.scale(2) // explosion actually grows, so we need space for it
    }
}