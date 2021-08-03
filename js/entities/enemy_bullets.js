import {BaseBullet} from "./base_bullet.js";
import {ENTITY_STATE} from "../core/enums.js";
import {game} from "../core/game.js";
import {Body} from "../physics/body.js";
import {ConstantSpeed, FollowTarget, MoveTowards} from "../components/movement_logic.js";
import Lifetime from "../components/lifetime.js";
import {Vector} from "../math/vector.js";

export {EnemyBullet, EnemyHauntingBullet, EnemyLaserBullet, SpinningBossBullet}

/**Base class for enemy's bullet.
 *
 */
class EnemyBullet extends BaseBullet {
    /**
     *
     * @param body Body representing physical position and properties
     * @param atlas atlas to render
     * @param damage damage on hit
     * @param movementLogic MovementLogic describing how this bullet will move
     */
    constructor(body, atlas, movementLogic, damage) {
        super(body, atlas, movementLogic)
        this.damage = damage
    }
}

/**Bullet that haunts the player.
 * Will destroy itself after 300 frames.
 */
class EnemyHauntingBullet extends EnemyBullet {
    /**
     *
     * @param pos Vector representing position
     */
    constructor(pos) {
        let body = new Body(pos, 50, 20)
        super(body, game.assets.textures["enemy_rocket"], new FollowTarget(game.player), 10)
        this.lifetime = this.components.add(new Lifetime(this, 300))
    }
    destroy() {
        this.state = ENTITY_STATE.DESTROYED
    }
}

/**Laser bullet fast and powerful
 */
class EnemyLaserBullet extends EnemyBullet {
    /**
     *
     * @param pos Vector representing position
     */
    constructor(pos) {
        let body = new Body(pos, 60, 30)
        super(body, game.assets.textures["laser_bullet"], new MoveTowards(game.player, 9.5), 50)
    }
    destroy() {
        this.state = ENTITY_STATE.DESTROYED
    }
}

class SpinningBossBullet extends EnemyBullet {
    constructor(boss) {
        let speed = new Vector(Math.cos(boss.body.rotation + Math.PI/2), Math.sin(boss.body.rotation + Math.PI/2))
        speed.length = boss.body.width/2
        let body = new Body(boss.body.center.add(speed), 30, 60)

        speed.length = 12;
        super(body, game.assets.textures["spinning_boss_bullet"], new ConstantSpeed(speed), 20)
    }
    destroy() {
        this.state = ENTITY_STATE.DESTROYED
    }
}
