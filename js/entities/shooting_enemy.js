import {BaseEnemy} from "./base_enemy.js";
import {game} from "../game.js";
import {ENEMY1_FIRE_RATE} from "../game_constants.js";
import {EnemyChasingBullet} from "./enemy_bullets.js";

export {ShootingEnemy}

class ShootingEnemy extends BaseEnemy {
    constructor(body, dx, dy, sprite, health, damage = 0) {
        super(body, dx, dy, game.assets["baseEnemy"], health, damage);
        this.fireState = 0
    }

    preUpdate() {
        this.fireState++;
        if (this.fireState === ENEMY1_FIRE_RATE) {
            this.fireState = 0
            let bull = new EnemyChasingBullet(this.body.centerX, this.body.centerY)
            game.gameObjects.push(bull)
        }
    }
}