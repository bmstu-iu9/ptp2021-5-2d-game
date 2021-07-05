import {BaseBullet} from "./base_bullet.js";

export {PlayerBullet}

/**Base class for player's bullet.
 * Every bullet fired by the player should be PlayerBullet's child.
 */
class PlayerBullet extends BaseBullet {
    /**
     *
     * @param body Body representing physical position and properties
     * @param sprite sprite to render
     * @param damage damage on hit
     */
    constructor(body, sprite, damage = 5) {
        super(body, sprite, damage)
    }
}