import {BaseBullet} from "./base_bullet.js";
import {ENTITY_STATE} from "../core/enums.js";
import {game} from "../core/game.js";
import Body from "../physics/body.js";
import {FollowTarget, MoveTowards} from "../components/movement_logic.js";
import Lifetime from "../components/lifetime.js";
import {ExplosionEffect} from "./effects.js";

export {EnemyBullet, EnemyHauntingBullet, EnemyLaserBullet}

/**
 * Base class for enemy's bullet.
 */
class EnemyBullet extends BaseBullet {
    /**
     *
     * @param body {Body} Body representing physical position and properties
     * @param atlasName {String} name of atlas loaded into AssetsManager
     * @param damage {Number} damage on hit
     * @param movementLogic {MovementLogic} MovementLogic describing how this bullet will move
     */
    constructor(body, atlasName, movementLogic, damage) {
        super(body, atlasName, movementLogic)
        this.damage = damage
    }
}

/**
 * Bullet that haunts the player.
 * Will destroy itself after {EnemyHauntingBullet.DURATION} frames.
 */
class EnemyHauntingBullet extends EnemyBullet {
    static DURATION = 300

    /**
     *
     * @param pos Vector representing position
     */
    constructor(pos) {
        let body = new Body(pos, 50, 20)
        super(body, "enemy_rocket", new FollowTarget(game.player), 10)
        this.lifetime = this.components.add(new Lifetime(this, EnemyHauntingBullet.DURATION))
    }

    get destructionEffect() {
        return new ExplosionEffect(this, 'explosion_purple', 500, 0.75)
    }

    destroy() {
        this.state = ENTITY_STATE.DESTROYED
    }
}

/**
 * Laser bullet fast and powerful.
 */
class EnemyLaserBullet extends EnemyBullet {
    /**
     *
     * @param pos Vector representing position
     */
    constructor(pos) {
        let body = new Body(pos, 60, 30)
        super(body, "laser_bullet", new MoveTowards(game.player, 9.5), 50)
    }

    destroy() {
        this.state = ENTITY_STATE.DESTROYED
    }
}
