import {BaseBullet} from "./base_bullet.js";
import {ENTITY_STATE} from "../core/enums.js";
import {game} from "../core/game.js";
import {Body} from "../physics/body.js";
import {FollowTarget} from "../components/movement_logic.js";
import Lifetime from "../components/lifetime.js";

export {EnemyBullet, EnemyHauntingBullet}

/**Base class for enemy's bullet.
 *
 */
class EnemyBullet extends BaseBullet {
    /**
     *
     * @param body Body representing physical position and properties
     * @param atlas atlas to render
     * @param damage damage on hit
     * @param movementLogic MovementLogic describing how this bullet will move
     */
    constructor(body, atlas, movementLogic, damage) {
        super(body, atlas, movementLogic)
        this.damage = damage
    }
}

/**Bullet that haunts the player.
 * Will destroy itself after 300 frames.
 */
class EnemyHauntingBullet extends EnemyBullet {
    /**
     *
     * @param pos Vector representing position
     */
    constructor(pos) {
        let body = new Body(pos, 50, 20)
        super(body, game.assets.textures["enemy_rocket"], new FollowTarget(game.player), 10)
        this.lifetime = this.components.add(new Lifetime(this, 300))
    }
    destroy() {
        this.state = ENTITY_STATE.DESTROYED
    }
}