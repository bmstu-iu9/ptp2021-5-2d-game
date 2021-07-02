import {BaseEntity} from "./base_entity.js";
import {game} from "../game.js";

export {
    Bullet
}

class Bullet extends BaseEntity {
    constructor(posX, posY, isEnemy) {
        let bSpeed = isEnemy ? 2 : -6;
        super(posX, posY, 0, bSpeed, game.constants.bulletWidth, game.constants.bulletHeight, game.assets["playerBullet"]);
    }

}