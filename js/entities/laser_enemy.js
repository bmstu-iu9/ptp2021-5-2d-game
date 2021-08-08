import {BaseEnemy} from "./base_enemy.js";
import {game} from "../core/game.js";
import {EnemyLaserBullet} from "./enemy_bullets.js";
import {BounceHorizontally} from "../components/movement_logic.js";
import Vector from "../math/vector.js";

export {LaserEnemy}

class LaserEnemy extends BaseEnemy {
    static FIRE_RATE = 150

    constructor(body, atlasName, health, damage = 0) {
        super(body, atlasName, health, damage);
        this.fireState = 0
        this.movementLogic = this.components.add(new BounceHorizontally(5))
    }

    update() {
        super.update()
        this.fireState++;
        if (this.fireState === LaserEnemy.FIRE_RATE) {
            this.fireState = 0
            let bull = new EnemyLaserBullet(new Vector(this.body.centerX, this.body.centerY))
            game.gameObjects.push(bull)
        }
    }
}
