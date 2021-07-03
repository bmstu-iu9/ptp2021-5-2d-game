import {BaseEntity} from "./base_entity.js";
import {game} from "../game.js";
import {Body} from "../physics/body.js";

export {
    Bullet
}

class Bullet extends BaseEntity {
    constructor(posX, posY, isEnemy) {
        let bSpeed = isEnemy ? 2 : -6;
        super(new Body(posX, posY, game.constants.BULLET_WIDTH, game.constants.BULLET_HEIGHT), 0, bSpeed,
            game.assets["playerBullet"])
    }

}