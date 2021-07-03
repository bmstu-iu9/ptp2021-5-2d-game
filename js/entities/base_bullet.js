import {BaseEntity} from "./base_entity.js";

export {
    BaseBullet
}

/** Base class for every bullet.
 * @param body <Body> representing physical position
 * @param dx speed along X-axis
 * @param dy speed along Y-axis
 * @param sprite sprite to render
 * @param damage damage on hit
 */
class BaseBullet extends BaseEntity {
    constructor(body, dx, dy, sprite, damage) {
        super(body, dx, dy, sprite)
        this.damage = damage
    }
}