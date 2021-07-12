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
     * @param atlas atlas to be rendered
     * @param health initial health
     * @param damage bullet's damage
     */
    constructor(body, atlas, health, damage = 0) {
        super(body, atlas)

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