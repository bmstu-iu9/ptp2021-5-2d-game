import {BaseEnemy} from "./base_enemy.js";
import {game} from "../core/game.js";
import {ENEMY1_FIRE_RATE} from "../core/game_constants.js";
import {EnemyHauntingBullet} from "./enemy_bullets.js";
import {Point} from "../math/point.js";

export {ShootingEnemy}

class ShootingEnemy extends BaseEnemy {
    constructor(body, sprite, health, damage = 0) {
        super(body, sprite, health, damage);
        this.fireState = 0
    }

    calculateMovement() {
        let newPos = this.body.pos.clone().moveBy(this.body.speed)
        if (newPos.x < 0 || newPos.x + this.body.width > game.playArea.width) {
            this.body.speed.x = -this.body.speed.x
        }
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