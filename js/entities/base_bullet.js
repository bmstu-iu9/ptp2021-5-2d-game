import {BaseEntity} from "./base_entity.js";

export {
    BaseBullet
}

/**Base class for every bullet.
 * Body's rotation always equals to the speed Vector angle.
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

    update() {
        super.update();
        this.body.rotation = this.body.speed.angle // set rotation according to speed vector angle
    }
}