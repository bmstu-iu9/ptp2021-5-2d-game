import {BaseBullet} from "./base_bullet.js";
import {ENEMY_HAUNTING_BULLET_SPEED, STATE_DESTROYED} from "../core/game_constants.js";
import {game} from "../core/game.js";
import {Body} from "../physics/body.js";
import {Vector} from "../math/vector.js";

export {EnemyBullet, EnemyHauntingBullet}

/**Base class for enemy's bullet.
 *
 */
class EnemyBullet extends BaseBullet {
    /**
     *
     * @param body Body representing physical position and properties
     * @param sprite sprite to render
     * @param damage damage on hit
     */
    constructor(body, sprite, damage) {
        super(body, sprite)
        this.damage = damage
    }
}

/**Bullet that haunts the player.
 * Will destroy itself after 1000 frames.
 */
class EnemyHauntingBullet extends EnemyBullet {
    /**
     *
     * @param pos Point representing position
     */
    constructor(pos) {
        super(new Body(pos, 50, 20, null), game.assets["enemy_haunting_bullet"], 15)
        this.lifetimeRemaining = 300
    }

    preUpdate() {
        this.lifetimeRemaining--
        if (this.lifetimeRemaining < 0) {
            this.destroy()
        }
    }

    calculateMovement() {
        let diffX = game.player.body.pos.x - this.body.pos.x,
            diffY = game.player.body.pos.y - this.body.pos.y

        let targetSpeed = new Vector(diffX, diffY)
        targetSpeed.length = ENEMY_HAUNTING_BULLET_SPEED

        this.body.speed.lerp(targetSpeed, 0.065)
        this.body.speed.length = ENEMY_HAUNTING_BULLET_SPEED
    }

    destroy() {
        this.state = STATE_DESTROYED
    }
}