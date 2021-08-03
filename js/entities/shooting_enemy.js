import {BaseEnemy} from "./base_enemy.js";
import {game} from "../core/game.js";
import {SHOOTING_ENEMY_FIRE_RATE} from "../core/game_constants.js";
import {EnemyHauntingBullet} from "./enemy_bullets.js";
import {BounceHorizontally} from "../components/movement_logic.js";
import {Vector} from "../math/vector.js";

export {ShootingEnemy}

class ShootingEnemy extends BaseEnemy {
    constructor(body, atlas, health, damage = 0) {
        super(body, atlas, health, damage);
        this.fireState = 0
        this.movementLogic = this.components.add(new BounceHorizontally(3))
    }

    update() {
        super.update()
        this.fireState++;
        if (this.fireState === SHOOTING_ENEMY_FIRE_RATE) {
            this.fireState = 0
            let bull = new EnemyHauntingBullet(new Vector(this.body.centerX, this.body.centerY))
            game.gameObjects.push(bull)
        }
    }
}
