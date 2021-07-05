import {BaseBullet} from "./base_bullet.js";
import {Body} from "../physics/body.js";
import {game} from "../game.js";
import {
    PLAYER_BULLET_DAMAGE,
    PLAYER_BULLET_HEIGHT,
    PLAYER_BULLET_SPEED,
    PLAYER_BULLET_WIDTH
} from "../game_constants.js";
import {Vector} from "../math/vector.js";

export {PlayerBullet}

/**Base class for player's bullet.
 * Every bullet fired by the player should be PlayerBullet's child.
 */
class PlayerBullet extends BaseBullet {
    /**
     *
     * @param pos Point representing position
     */
    constructor(pos) {
        super(new Body(pos, PLAYER_BULLET_WIDTH, PLAYER_BULLET_HEIGHT, new Vector(0, -PLAYER_BULLET_SPEED)),
            game.assets["playerBullet"], PLAYER_BULLET_DAMAGE)
    }
}