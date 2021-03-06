import {BaseBoss} from "./base_boss.js";
import {game} from "../core/game.js";
import {RandomSpin} from "../components/movement_logic.js";
import {SpinningBossBullet} from "./enemy_bullets.js";
import {REWARD, SPINNING_BOSS_FIRE_RATE} from "../core/game_constants.js";
import SoundManager from "../core/sound_manager.js";

export {
    SpinningBoss
}

/**
 * Boss that rotates itself and fires bullets at a high rate.
 */
class SpinningBoss extends BaseBoss {
    constructor(body, atlasName, health, damage = 10, reward = REWARD.SPINNING_BOSS, hpBarWidth = body.width * 0.6) {
        super(body, atlasName, health, damage, reward, hpBarWidth);

        this.body.rotation = Math.PI / 3
        this.movementLogic = this.components.add(new RandomSpin(this, 0.015))
        this.fireState = 0
    }

    update() {
        super.update()
        this.fireState++;
        if (this.fireState === SPINNING_BOSS_FIRE_RATE) {
            this.fireState = 0
            game.gameObjects.push(new SpinningBossBullet(this))

            SoundManager.enemySounds("spinning_boss_shot")
        }
    }
}
