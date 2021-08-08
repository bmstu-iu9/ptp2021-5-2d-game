import BaseEntity from "./base_entity.js";
import {ExplosionEffect} from "./effects.js"

export {BaseEnemy}

/**
 * Base class for every enemy ship.
 */
class BaseEnemy extends BaseEntity {
    /**
     *
     * @param body {Body} Body representing physical position and properties
     * @param atlasName name of atlas loaded into AssetsManager
     * @param health initial health
     * @param damage collision's damage
     */
    constructor(body, atlasName, health, damage = 0) {
        super(body, atlasName)

        this.health = health
        this.damage = damage
    }

    get destructionEffect() {
        return new ExplosionEffect(this, "explosion_orange", 500, 2)
    }

    receiveDamage(amount) {
        this.health -= amount
        if (this.health <= 0) {
            this.destroy()
        }
    }

}