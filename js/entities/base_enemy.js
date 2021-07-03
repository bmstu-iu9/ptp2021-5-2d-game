import {BaseEntity} from "./base_entity.js";
import {game} from "../game.js";

export {
    BaseEnemy
}

/** Base class for every enemy ship
 * @param body <Body> representing physical position
 * @param dx initial speed along X-axis
 * @param dy initial speed along Y-axis
 * @param sprite sprite to be rendered
 * @param health initial health
 * @param damage bullet's damage
 */
class BaseEnemy extends BaseEntity {
    constructor(body, dx, dy, sprite, health, damage = 0) {
        super(body, dx, dy, game.assets["baseEnemy"]);
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