import {BaseEnemy} from "./base_enemy.js";
import {game} from "../game.js";
import {ENEMY1_FIRE_RATE} from "../game_constants.js";
import {EnemyHauntingBullet} from "./enemy_bullets.js";
import {Point} from "../math/point.js";

export {ShootingEnemy}

class ShootingEnemy extends BaseEnemy {
    constructor(body, sprite, health, damage = 0) {
        super(body, game.assets["enemy_ship"], health, damage);
        this.fireState = 0
    }

    preUpdate() {
        this.fireState++;
        if (this.fireState === ENEMY1_FIRE_RATE) {
            this.fireState = 0
            let bull = new EnemyHauntingBullet(new Point(this.body.centerX, this.body.centerY))
            game.gameObjects.push(bull)
        }
    }
}