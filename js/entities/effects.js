import BaseEffect from "./base_effect.js";

export {ExplosionEffect}

class ExplosionEffect extends BaseEffect {
    constructor(body, atlas) {
        super(body, atlas)
        this.body.scale(2)
    }
}