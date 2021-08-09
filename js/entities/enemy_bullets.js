import {BaseBullet} from "./base_bullet.js";
import {game} from "../core/game.js";
import Body from "../physics/body.js";
import {ConstantSpeed, FollowTarget, MoveTowards} from "../components/movement_logic.js";
import Lifetime from "../components/lifetime.js";
import {ExplosionEffect} from "./effects.js";
import Vector from "../math/vector.js";

export {EnemyBullet, EnemyHauntingBullet, EnemyLaserBullet, SpinningBossBullet}

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
        this.lifetime = this.components.add(new Lifetime(EnemyHauntingBullet.DURATION))
    }

    get destructionEffect() {
        return new ExplosionEffect(this, 'explosion_purple', 500, 0.75)
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
}

/**
 * <p>Bullet fired by {@link SpinningBoss}.
 * <p>Just a simple bullet with constant speed, which is fired with respect to Boss's rotation.
 */
class SpinningBossBullet extends EnemyBullet {
    static SPEED = 12
    static DAMAGE = 20

    constructor(boss) {
        let angle = boss.body.rotation + Math.PI / 2,
            direction = new Vector(Math.cos(angle), Math.sin(angle)),
            adjustedPos = boss.body.center.add(direction.clone().scale(boss.body.width / 2)),
            speedVector = direction.clone().scale(SpinningBossBullet.SPEED)

        super(new Body(adjustedPos, 30, 60), "spinning_boss_bullet",
            new ConstantSpeed(speedVector), SpinningBossBullet.DAMAGE)
    }
}
