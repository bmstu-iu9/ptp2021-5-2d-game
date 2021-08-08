import BaseEntity from "./base_entity.js";

export {
    BaseBullet
}

/**
 * <p>Base class for every bullet.
 * <br>**This class automatically handles its body rotation.**
 * <p>If this bullet's MovementLogic provides property "rotation" then bullet's body.rotation will
 * be set from bullet.movementLogic.rotation. Otherwise body.rotation will be set from speed vector angle.
 */
class BaseBullet extends BaseEntity {
    /**
     * @param body Body representing physical pos
     * @param atlasName name of atlas loaded into AssetsManager
     * @param damage damage on hit
     * @param movementLogic MovementLogic describing how this bullet will move
     */
    constructor(body, atlasName, movementLogic, damage) {
        super(body, atlasName)
        this.movementLogic = this.components.add(movementLogic)
        this.damage = damage
    }

    /**
     * Hits the target with specified damage.
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