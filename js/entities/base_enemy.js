import BaseEntity from "./base_entity.js";
import {ExplosionEffect} from "./effects.js"
import {REWARD} from "../core/game_constants.js";

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
     * @param reward reward for killing an enemy
     */
    constructor(body, atlasName, health, damage = 0, reward = REWARD.BASE_ENEMY) {
        super(body, atlasName)
        this.reward = reward
        this.health = health
        this.damage = damage
    }

    get destructionEffect() {
        return new ExplosionEffect(this, "explosion_orange", 1200, 2)
    }

    get destructionSoundName() {
        return "explosion"
    }

    receiveDamage(amount) {
        this.health -= amount
        if (this.health <= 0) {
            this.destroy()
        }
    }

}
