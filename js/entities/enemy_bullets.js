import {BaseBullet} from "./base_bullet.js";
import {ENEMY_CHASING_BULLET_SPEED, STATE_DESTROYED} from "../game_constants.js";
import {game} from "../game.js";
import {Body} from "../physics/body.js";

export {EnemyBullet, EnemyChasingBullet}

/** Base class for enemy's bullet.
 * Every bullet fired by the enemy should be <EnemyBullet>'s child.
 * @param body <Body> representing physical position of the bullet
 * @param dx initial speed along X-axis
 * @param dy initial speed along Y-axis
 * @param sprite sprite to render
 * @param damage damage on hit*/
class EnemyBullet extends BaseBullet {
    constructor(body, dx, dy, sprite, damage) {
        super(body, dx, dy, sprite)
        this.damage = damage
    }
}

class EnemyChasingBullet extends EnemyBullet {
    constructor(posX, posY) {
        super(new Body(posX, posY, 50, 20), 0, 0, game.assets["enemyRocket"], 15)
        this.lifetime = 1000
        console.log("chasing bullet created")
    }

    preUpdate() {
        this.lifetime--
        if (this.lifetime < 0) {
            this.destroy()
        }
    }

    calculateMovement() {
        let diffX = game.player.body.posX - this.body.posX,
            diffY = game.player.body.posY - this.body.posY

        let targetAngle = Math.atan2(diffY, diffX);
        let deltaAngle = targetAngle - this.body.rotation
        this.body.rotation += deltaAngle

        this.dx = ENEMY_CHASING_BULLET_SPEED * Math.cos(this.body.rotation)
        this.dy = ENEMY_CHASING_BULLET_SPEED * Math.sin(this.body.rotation)
    }

    destroy() {
        this.state = STATE_DESTROYED
        console.log("chasing bullet dead")
    }
}