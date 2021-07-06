import {BaseEntity} from "./base_entity.js";

export {
    BaseEnemy
}

/**Base class for every enemy ship.
 *
 */
class BaseEnemy extends BaseEntity {
    /**
     *
     * @param body {Body} Body representing physical position and properties
     * @param sprite sprite to be rendered
     * @param health initial health
     * @param damage bullet's damage
     */
    constructor(body, sprite, health, damage = 0) {
        super(body, sprite)
        this.health = health
        this.damage = damage
    }

    receiveDamage(amount) {
        this.health -= amount
        if (this.health <= 0) {
            this.destroy()
        }
    }

}