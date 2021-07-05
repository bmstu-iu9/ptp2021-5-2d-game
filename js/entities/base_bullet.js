import {BaseEntity} from "./base_entity.js";

export {
    BaseBullet
}

/**Base class for every bullet.
 *
 */
class BaseBullet extends BaseEntity {
    /**
     * @param body Body representing physical pos
     * @param sprite sprite to render
     * @param damage damage on hit
     */
    constructor(body, sprite, damage) {
        super(body, sprite)
        this.damage = damage
    }
}