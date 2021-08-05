import {BaseEffect, BaseTargetedEffect} from "./base_effect.js";
import {Body} from "../physics/body.js";
import Vector from "../math/vector.js";

export {ExplosionEffect, HealEffect}

/**
 * Visual effect of an explosion.
 */
class ExplosionEffect extends BaseTargetedEffect {
    /**
     *
     * @param target a BaseEntity to play this Effect on.
     * @param atlasName the frames of this effect packed in a SpriteSheet
     * @param duration the duration of Effect's animation
     * @param dimFactor the number to multiply target's dimensions by
     */
    constructor(target, atlasName = 'explosion_orange', duration = 500, dimFactor = 2) {
        super(target, atlasName, duration, dimFactor)
    }
}

/**
 * Visual effect of healing.
 */
class HealEffect extends BaseTargetedEffect {
    /**
     *
     * @param target a BaseEntity to play this Effect on
     */
    constructor(target) {
        super(target, "heal_animation", 500, 1.35)

        this.opacity = 0.75

        this.target = target
    }

    draw(ctx) {
        ctx.globalAlpha = 0.75
        let cell = this.atlas.cells[this.cellIndex]
        ctx.drawImage(this.atlas.image, cell.x, cell.y, cell.w, cell.h, this.body.pos.x, this.body.pos.y,
            this.body.width, this.body.height)
        ctx.globalAlpha = 1
    }
}