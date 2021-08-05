import {BaseBullet} from "./base_bullet.js";
import {game} from "../core/game.js";
import {Body} from "../physics/body.js";
import {PLAYER_BOOSTER_DURATION, PLAYER_LASER_WIDTH} from "../core/game_constants.js";
import {ClipToTarget, ConstantSpeed, SpinAround} from "../components/movement_logic.js";
import Vector from "../math/vector.js";
import Lifetime from "../components/lifetime.js";
import {BaseBoss} from "./base_boss.js";

export {PlayerBullet, SimplePlayerBullet, PlayerLaser, PlayerOrbitalShield}

/**Base class for player's bullet.
 * Every bullet fired by the player should be PlayerBullet's child.
 */
class PlayerBullet extends BaseBullet {
    /**
     *
     * @param body {Body}
     * @param atlas atlas to render
     * @param damage damage on hit
     * @param movementLogic MovementLogic
     */
    constructor(body, atlasName, movementLogic, damage = 5) {
        super(body, atlasName, movementLogic, damage)
    }
}

class SimplePlayerBullet extends PlayerBullet {
    constructor(body, atlasName, speed, damage) {
        super(body, atlasName, new ConstantSpeed(speed), damage)
    }
}

class PlayerLaser extends PlayerBullet {
    static WIDTH = 30

    constructor(pos) {
        super(new Body(pos.clone(), PlayerLaser.WIDTH, 100), "player_laser",
            new ClipToTarget(game.player, ClipToTarget.MODE_CENTER, null, 0, 0))

        this.body.pos.y = 0
        this.body.pos.x = game.player.body.centerX - this.body.width / 2

        this.extraWidthRate = 0.2

        this.lifetime = this.components.add(new Lifetime(PLAYER_BOOSTER_DURATION))

        this.damage = 1;
    }

    update() {
        super.update()
        this.body.height = game.player.body.pos.y

        // Pulsate
        this.body.width += this.extraWidthRate
        if (this.body.width < (PlayerLaser.WIDTH - 5) || this.body.width > (PlayerLaser.WIDTH + 5))
            this.extraWidthRate = -this.extraWidthRate
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
    static BOSS_DAMAGE = 3

    constructor() {
        super(new Body(new Vector(game.player.body.centerX, game.player.body.centerY), 50, 50), "orbital_shield",
            new SpinAround(game.player, 150, (Math.PI * 2) / 60))

        this.body.pos.x = game.player.body.centerX - this.body.width / 2
        this.body.pos.y = game.player.body.centerY + 125 - this.body.height / 2

        this.lifetimeRemaining = 2 * PLAYER_BOOSTER_DURATION

        this.bossDamage = 3
    }

    update() {
        super.update()

        if (--this.lifetimeRemaining <= 0)
            this.destroy()
    }

    //Destroys target if it collide with the shield. We dont use collision rules because the shield is a kind of a
    // bullet for us.
    hit(target) {
        if (target instanceof BaseBoss) {
            target.receiveDamage(PlayerOrbitalShield.BOSS_DAMAGE)
        } else {
            target.destroy()
        }
    }
}