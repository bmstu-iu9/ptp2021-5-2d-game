import {BaseEnemy} from "./base_enemy.js";
import {game} from "../core/game.js";
import {EnemyHauntingBullet, EnemyLaserBullet} from "./enemy_bullets.js";
import {BounceHorizontally} from "../components/movement_logic.js";
import Vector from "../math/vector.js";
import {REWARD} from "../core/game_constants.js";
import SoundManager from "../core/sound_manager.js";

export {
    ArmedEnemy,
    HunterEnemy,
    LaserEnemy
}

/**
 * Base class for every enemy which fires bullets.
 */
class ArmedEnemy extends BaseEnemy {
    constructor(body, atlasName, health, damage = 0, fireRate, reward = REWARD.HUNTER_ENEMY) {
        super(body, atlasName, health, damage, reward)

        this.fireRate = fireRate
        this.fireState = 0
    }

    /**
     * Spawn this Enemy's bullet.
     */
    fire() {
        throw "Not implemented!"
    }

    update() {
        super.update()

        if (++this.fireState === this.fireRate) {
            this.fireState = 0

            this.fire()

            SoundManager.enemySounds("shooting_enemy_shot")
        }
    }
}

class HunterEnemy extends ArmedEnemy {
    constructor(body) {
        super(body, 'hunter_enemy', 15, 10, 150, REWARD.HUNTER_ENEMY)

        this.movementLogic = this.components.add(new BounceHorizontally(3))
    }

    fire() {
        let bull = new EnemyHauntingBullet(new Vector(this.body.centerX, this.body.centerY))
        game.gameObjects.push(bull)
    }
}

class LaserEnemy extends ArmedEnemy {
    constructor(body) {
        super(body, 'laser_enemy', 10, 25, 150, REWARD.LASER_ENEMY)

        this.movementLogic = this.components.add(new BounceHorizontally(5))
    }

    fire() {
        let bull = new EnemyLaserBullet(new Vector(this.body.centerX, this.body.centerY))
        game.gameObjects.push(bull)
    }
}
