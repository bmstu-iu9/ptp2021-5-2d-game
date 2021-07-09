import {BaseBullet} from "./base_bullet.js";
import {game} from "../core/game.js";
import {Body} from "../physics/body.js";
import {PLAYER_BOOSTER_DURATION, PLAYER_LASER_WIDTH} from "../core/game_constants.js";

export {PlayerBullet, PlayerLaser}

/**Base class for player's bullet.
 * Every bullet fired by the player should be PlayerBullet's child.
 */
class PlayerBullet extends BaseBullet {
    /**
     *
     * @param body {Body}
     * @param sprite sprite to render
     * @param damage damage on hit
     */
    constructor(body, sprite, damage = 5) {
        super(body, sprite, damage)
    }
}

class PlayerLaser extends PlayerBullet {
    constructor(pos) {
        super(new Body(pos.clone(), PLAYER_LASER_WIDTH, 100), game.assets["player_laser"], 5)

        this.body.pos.y = 0
        this.body.pos.x = game.player.body.centerX - this.body.width / 2

        this.extraWidthRate = 0.2
        this.lifetimeRemaining = PLAYER_BOOSTER_DURATION
    }

    update() {
        // Follow player
        this.body.pos.x = game.player.body.centerX - this.body.width / 2
        this.body.height = game.player.body.pos.y

        // Pulsate
        this.body.width += this.extraWidthRate
        if (this.body.width < (PLAYER_LASER_WIDTH - 5) || this.body.width > (PLAYER_LASER_WIDTH + 5))
            this.extraWidthRate = -this.extraWidthRate

        // Track lifetime
        if (--this.lifetimeRemaining <= 0)
            this.destroy()
    }

    hit(target) {
        if ("receiveDamage" in target) {
            target.receiveDamage(this.damage)
        } else {
            target.destroy()
        }
    }
}