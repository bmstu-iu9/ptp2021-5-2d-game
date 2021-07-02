import {BaseEntity} from "./base_entity.js";
import {game} from "../game.js";

export {
    BaseEnemy
}

class BaseEnemy extends BaseEntity {
    constructor(posX, posY, dx, dy, width, height) {
        super(posX, posY, dx, dy, width, height, game.assets["baseEnemy"]);
    }

}