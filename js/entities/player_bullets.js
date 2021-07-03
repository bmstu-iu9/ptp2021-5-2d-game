import {BaseBullet} from "./base_bullet.js";
import {Body} from "../physics/body.js";
import {game} from "../game.js";
import {
    PLAYER_BULLET_DAMAGE,
    PLAYER_BULLET_HEIGHT,
    PLAYER_BULLET_SPEED,
    PLAYER_BULLET_WIDTH
} from "../game_constants.js";

export {PlayerBullet}

/** Base class for player's bullet.
 * Every bullet fired by the player should be <PlayerBullet>'s child.
 * @param posX bullet's position along X-axis
 * @param posY bullet's position along Y-axis*/
class PlayerBullet extends BaseBullet {
    constructor(posX, posY) {
        super(new Body(posX, posY, PLAYER_BULLET_WIDTH, PLAYER_BULLET_HEIGHT),
            0, -PLAYER_BULLET_SPEED, game.assets["playerBullet"], PLAYER_BULLET_DAMAGE)
    }
}