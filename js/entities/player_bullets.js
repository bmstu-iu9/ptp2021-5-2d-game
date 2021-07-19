import {BaseBullet} from "./base_bullet.js";
import {game} from "../core/game.js";
import {Body} from "../physics/body.js";
import {PLAYER_BOOSTER_DURATION, PLAYER_LASER_WIDTH} from "../core/game_constants.js";
import {ClipToTarget, ConstantSpeed, SpinAround} from "../components/movement_logic.js";
import {Vector} from "../math/vector.js";
import Lifetime from "../components/lifetime.js";

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
    constructor(body, atlas, movementLogic, damage = 5) {
        super(body, atlas, movementLogic, damage)
    }
}

class SimplePlayerBullet extends PlayerBullet {
    constructor(body, atlas, speed, damage) {
        super(body, atlas, new ConstantSpeed(speed), damage)
    }
}

class PlayerLaser extends PlayerBullet {
    constructor(pos) {
        super(new Body(pos.clone(), PLAYER_LASER_WIDTH, 100),
            game.assets.textures["player_laser"],
            new ClipToTarget(game.player, 'center', null, 0, 0))

        this.body.pos.y = 0
        this.body.pos.x = game.player.body.centerX - this.body.width / 2

        this.extraWidthRate = 0.2

        this.lifetime = this.components.add(new Lifetime(PLAYER_BOOSTER_DURATION))
    }

    update() {
        super.update()
        this.body.height = game.player.body.pos.y

        // Pulsate
        this.body.width += this.extraWidthRate
        if (this.body.width < (PLAYER_LASER_WIDTH - 5) || this.body.width > (PLAYER_LASER_WIDTH + 5))
            this.extraWidthRate = -this.extraWidthRate
    }

    hit(target) {
        if ("receiveDamage" in target) {
            target.receiveDamage(this.damage)
        } else {
            target.destroy()
        }
    }
}
class PlayerOrbitalShield extends PlayerBullet{
    constructor() {
        super(new Body(new Vector(game.player.body.centerX, game.player.body.centerY), 50, 50),
            game.assets.textures["orbital_shield"],
            new SpinAround(game.player, 150, (Math.PI * 2) / 90))

        this.body.rotation = 0
        this.body.pos.x = game.player.body.centerX - this.body.width / 2
        this.body.pos.y = game.player.body.centerY + 125 - this.body.height / 2

        this.lifetimeRemaining = 2 * PLAYER_BOOSTER_DURATION
    }
    update() {
        this.body.rotation += (Math.PI * 2) / 90
        super.update()

        if (--this.lifetimeRemaining <= 0)
            this.destroy()
    }
    //Destroys target if it collide with the shield. We dont use collision rules because the shield is a kind of a bullet for us.
    hit(target) {
        target.destroy()
    }
}