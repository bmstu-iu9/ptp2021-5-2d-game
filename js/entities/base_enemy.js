import {BaseEntity} from "./base_entity.js";
import {game} from "../game.js";

export {
    BaseEnemy
}

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