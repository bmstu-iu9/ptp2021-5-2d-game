import {BaseEntity} from "./base_entity.js";

export {
    BaseBullet
}

/**Base class for every bullet.
 * Body's rotation always equals to the maxSpeed Vector angle.
 */
class BaseBullet extends BaseEntity {
    /**
     * @param body Body representing physical pos
     * @param atlas atlas to render
     * @param damage damage on hit
     * @param movementLogic MovementLogic describing how this bullet will move
     */
    constructor(body, atlas, movementLogic, damage) {
        super(body, atlas)
        this.movementLogic = this.components.add(movementLogic)
        this.damage = damage
    }

    /**Hits the target with specified damage.
     * Bullet is destroyed after hit.
     * Should be called by CollisionRule.
     *
     * @param target gameObject to be hit
     */
    hit(target) {
        if ("receiveDamage" in target) {
            target.receiveDamage(this.damage)
        } else {
            target.destroy()
        }

        this.destroy()
    }

    update() {
        super.update()
        this.body.rotation = this.movementLogic.rotation || this.movementLogic.speed.angle
    }
}