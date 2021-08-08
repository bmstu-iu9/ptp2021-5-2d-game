import {BaseBoss} from "./base_boss.js";
import {game} from "../core/game.js";
import {RandomSpin} from "../components/movement_logic.js";
import {SpinningBossBullet} from "./enemy_bullets.js";
import {SPINNING_BOSS_FIRE_RATE} from "../core/game_constants.js";

export {
    SpinningBoss
}

class SpinningBoss extends BaseBoss {
    constructor(body, atlas, health, damage = 10, hpBarWidth = body.width * 0.6) {
        body.rotation = Math.PI / 3
        super(body, atlas, health, damage, hpBarWidth);
        this.movementLogic = this.components.add(new RandomSpin(this, 0.015))
        this.fireState = 0
    }

    update() {
        super.update()
        this.fireState++;
        if (this.fireState === SPINNING_BOSS_FIRE_RATE) {
            this.fireState = 0
            game.gameObjects.push(new SpinningBossBullet(this))
        }
    }
}
