import {BaseEntity} from "./base_entity.js";
import {ClipToTarget} from "../components/movement_logic.js";
import {Body} from "../physics/body.js";
import Vector from "../math/vector.js";

export {BaseEffect, BaseTargetedEffect}

/**
 * <p>Base class for every visual effect.</p>
 * <p>Should not be instantiated directly.</p>
 */
class BaseEffect extends BaseEntity {
    /**
     *
     * @param body {Body} this Effect's Body
     * @param atlasName {String} name of atlas loaded into AssetsManager
     * @param duration Effect's animation duration (in milliseconds)
     * @param repeatOnce {boolean} if this Effect should be destroyed after the animation is complete
     */
    constructor(body, atlasName, duration = 500, repeatOnce = true) {
        super(body, atlasName)

        this.body.rotation = 0

        this.animationManager.currentAnimation.duration = duration
        if (repeatOnce) {
            this.animationManager.currentAnimation.loop = false
            this.animationManager.currentAnimation.onComplete.addListener(() => {this.destroy()}, this)
        }
    }
}

/**
 * <p>Base class for every visual effect that is played on a specific target.<p>
 * <ul>
 *     <li>This Effect will play once (loop=false).
 *     <li>This Effect will clip to its target's center.
 *     <li>This Effect is destroyed on its target's destruction.
 * </ul>
 * <p>Should not be instantiated directly.
 */
class BaseTargetedEffect extends BaseEffect {
    /**
     *
     * @param target an Entity to play this Effect on
     * @param atlasName name of atlas loaded into AssetsManager
     * @param duration Effect's animation duration (in milliseconds)
     * @param dimFactor target dimensions multiplier. For example if target is 100x100 and dimFactor=2, then this
     * Effect will be 200x200.
     */
    constructor(target, atlasName, duration = 500, dimFactor = 1.5) {
        let maxDim = Math.max(target.body.width, target.body.height) * dimFactor,
            effectBody = new Body(new Vector(), maxDim, maxDim)
        effectBody.center = target.body.center

        super(effectBody, atlasName, duration, true)

        this.movementLogic = this.components.add(
            new ClipToTarget(target, ClipToTarget.MODE_CENTER, ClipToTarget.MODE_CENTER))
        this.target = target
        this.target.onDestroyed.addListener(function () {this.destroy()}, this)
    }
}
