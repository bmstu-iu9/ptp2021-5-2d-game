import {BaseEnemy} from "./base_enemy.js";
import {game} from "../core/game.js";
import {EnemyHauntingBullet} from "./enemy_bullets.js";
import {BounceHorizontally} from "../components/movement_logic.js";
import Vector from "../math/vector.js";
import {REWARD} from "../core/game_constants.js";
import SoundManager from "../core/sound_manager.js";

export {ShootingEnemy}

class ShootingEnemy extends BaseEnemy {
    static FIRE_RATE = 150

    constructor(body, atlasName, health, damage = 0, reward = REWARD.SHOOTING_ENEMY) {
        super(body, atlasName, health, damage, reward);
        this.fireState = 0
        this.movementLogic = this.components.add(new BounceHorizontally(3))
    }

    get destructionSound() {
        return "explosion"
    }

    update() {
        super.update()
        this.fireState++;
        if (this.fireState === ShootingEnemy.FIRE_RATE) {
            this.fireState = 0
            let bull = new EnemyHauntingBullet(new Vector(this.body.centerX, this.body.centerY))
            game.gameObjects.push(bull)

            SoundManager.enemySounds("shooting_enemy_shot")
        }
    }
}
