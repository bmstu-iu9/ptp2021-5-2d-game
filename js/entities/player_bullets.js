import {BaseBullet} from "./base_bullet.js";
import Body from "../physics/body.js";
import {ClipToTarget, ConstantSpeed, SpinAround} from "../components/movement_logic.js";

import Vector from "../math/vector.js";
import Lifetime from "../components/lifetime.js";
import {BaseBoss} from "./base_boss.js";
import {PLAYER} from "../core/game_constants.js";
import {WEAPON_TYPE} from "../core/enums.js";
import {ExplosionEffect} from "./effects.js";
import Shared from "../util/shared.js";

export {PlayerBullet, SimplePlayerBullet, PlayerLaser, PlayerOrbitalShield}

/**
 * <p>Base class for player's bullet.
 * <p>Every bullet fired by the player should inherit from PlayerBullet.
 */
class PlayerBullet extends BaseBullet {
    /**
     *
     * @param body {Body}
     * @param atlasName name of atlas loaded into AssetsManager
     * @param damage damage on hit
     * @param movementLogic MovementLogic
     */
    constructor(body, atlasName, movementLogic, damage = PLAYER.BULLET.DAMAGE) {
        super(body, atlasName, movementLogic, damage)
    }
}

/**
 * Just regular Player's bullet.
 */
class SimplePlayerBullet extends PlayerBullet {
    constructor(body, atlasName, speed, damage) {
        super(body, atlasName, new ConstantSpeed(speed), damage)
    }

    get destructionEffect() {
        return new ExplosionEffect(this, 'explosion_blue', 500, 0.75)
    }
}

/**
 * <p>Player's laser ray.
 * <p>The Laser is attached to Player's front and destroys all targets hit by Laser. The Laser does not destroy boss
 * immediately, instead it deals a continuous damage to it.
 */
class PlayerLaser extends PlayerBullet {
    constructor(pos) {
        let w = PLAYER.POWERUPS.LASER.WIDTH,
            h = 0,
            clipToTarget = new ClipToTarget(Shared.player, ClipToTarget.MODE_CENTER, null, 0, 0),
            damage = PLAYER.POWERUPS.LASER.DAMAGE
        super(new Body(pos.clone(), w, h), "player_laser", clipToTarget, damage)

        this.body.pos.x = Shared.player.body.centerX - this.body.width / 2
        this.body.pos.y = 0

        this.pulsationRate = 0.2

    }

    update() {
        super.update()
        this.body.height = Shared.player.body.pos.y

        // Pulsate
        this.body.width += this.pulsationRate
        if (this.body.width < (PLAYER.POWERUPS.LASER.WIDTH - 5) || this.body.width > (PLAYER.POWERUPS.LASER.WIDTH + 5))
            this.pulsationRate = -this.pulsationRate
        if (Shared.player.currentWeaponType !== WEAPON_TYPE.LASER) {
            this.destroy()
        }
    }

    /**
     * Hit target
     * @param target {BaseEntity} a target to be hit. If target is not a boss, it will be destroyed immediately.
     */
    hit(target) {
        if (target instanceof BaseBoss) {
            target.receiveDamage(this.damage)
        } else {
            target.destroy()
        }
    }
}

class PlayerOrbitalShield extends PlayerBullet {
    constructor() {
        let w = PLAYER.POWERUPS.ORBITAL_SHIELD.DIMENSIONS,
            h = PLAYER.POWERUPS.ORBITAL_SHIELD.DIMENSIONS,
            spinAround = new SpinAround(Shared.player, 150, (Math.PI * 2) / 60)
        super(new Body(new Vector(), w, h), "orbital_shield", spinAround)

        this.movementLogic.update() // appear at correct position

        this.lifetime = this.components.add(new Lifetime(PLAYER.POWERUPS.DURATION))
    }

    //Destroys target if it collide with the shield. We dont use collision rules because the shield is a kind of a
    //bullet for us.
    hit(target) {
        if (target instanceof BaseBoss) {
            target.receiveDamage(PLAYER.POWERUPS.ORBITAL_SHIELD.BOSS_DAMAGE)
        } else {
            target.destroy()
        }
    }
}
