import {BaseEffect, BaseTargetedEffect} from "./base_effect.js";
import Body from "../physics/body.js";
import Vector from "../math/vector.js";
import Shield from "./shield.js";

export {ExplosionEffect, HealEffect, LightningEffect}

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

        if (target.hasOwnProperty("shield") && target.shield instanceof Shield)
            this.opacity = 0.5
    }
}

/**
 * Visual effect of lightning between two BaseEntities.
 */
class LightningEffect extends BaseEffect {
    /**
     *
     * @param origin {BaseEntity} an Entity to start lightning from
     * @param target {BaseEntity} an Entity where the lightning will end
     */
    constructor(origin, target) {
        super(new Body(new Vector(), 50, 0), "lightning_animation", 800, false)

        this.origin = origin
        this.target = target
    }

    update() {
        super.update()

        this.body.centerX = (this.origin.body.centerX + this.target.body.centerX) / 2
        this.body.centerY = (this.origin.body.centerY + this.target.body.centerY) / 2

        let distanceVector = this.origin.body.center.subtract(this.target.body.center)

        this.body.rotation = distanceVector.angle + Math.PI / 2
        this.body.height = distanceVector.length
    }
}