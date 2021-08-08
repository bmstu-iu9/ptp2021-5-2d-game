import {BaseBullet} from "./base_bullet.js";
import {game} from "../core/game.js";
import Body from "../physics/body.js";
import {ClipToTarget, ConstantSpeed, SpinAround} from "../components/movement_logic.js";

import Vector from "../math/vector.js";
import Lifetime from "../components/lifetime.js";
import {BaseBoss} from "./base_boss.js";
import {PLAYER} from "../core/game_constants.js";
import {WEAPON_TYPE} from "../core/enums.js";

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

class SimplePlayerBullet extends PlayerBullet {
    constructor(body, atlasName, speed, damage) {
        super(body, atlasName, new ConstantSpeed(speed), damage)
    }
}

/**
 * <p>Player's laser ray.
 * <p>The Laser is attached to Player's front and deals continuous damage to
 * all targets hit by the Laser.
 */
class PlayerLaser extends PlayerBullet {
    constructor(pos) {
        let w = PLAYER.POWERUPS.LASER.WIDTH,
            h = 0,
            clipToTarget = new ClipToTarget(game.player, ClipToTarget.MODE_CENTER, null, 0, 0),
            damage = PLAYER.POWERUPS.LASER.DAMAGE
        super(new Body(pos.clone(), w, h), "player_laser", clipToTarget, damage)

        this.body.pos.x = game.player.body.centerX - this.body.width / 2
        this.body.pos.y = 0

        this.pulsationRate = 0.2

    }

    update() {
        super.update()
        this.body.height = game.player.body.pos.y

        // Pulsate
        this.body.width += this.pulsationRate
        if (this.body.width < (PLAYER.POWERUPS.LASER.WIDTH - 5) || this.body.width > (PLAYER.POWERUPS.LASER.WIDTH + 5))
            this.pulsationRate = -this.pulsationRate
        if (game.player.currentWeaponType !== WEAPON_TYPE.LASER) {
            this.destroy()
        }
    }

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
            spinAround = new SpinAround(game.player, 150, (Math.PI * 2) / 60)
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
