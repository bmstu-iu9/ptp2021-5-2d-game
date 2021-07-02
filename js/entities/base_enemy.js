import {BaseEntity} from "./base_entity.js";
import {game} from "../game.js";

export {
    BaseEnemy
}

class BaseEnemy extends BaseEntity {
    constructor(body, dx, dy, sprite) {
        super(body, dx, dy, game.assets["baseEnemy"]);
    }

}