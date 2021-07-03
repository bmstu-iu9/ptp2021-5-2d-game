import {BaseEntity} from "./base_entity.js";
import {game} from "../game.js";
import {Body} from "../physics/body.js";

export {
    Bullet
}

/** Base class for a bullet.
 * @param posX position on X axis
 * @param posY position on Y axis
 * @param isEnemy if enemy or player fired a bullet*/
class Bullet extends BaseEntity {
    constructor(posX, posY, isEnemy, damage) {
        let bSpeed = isEnemy ? 2 : -6;
        super(new Body(posX, posY, game.constants.BULLET_WIDTH, game.constants.BULLET_HEIGHT), 0, bSpeed,
            game.assets["playerBullet"])
        this.isEnemy = isEnemy
        this.damage = damage
    }

}