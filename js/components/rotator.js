import Easing from "../util/easing.js";
import Component from "../core/component.js";

export {Rotator}

/**
 * Gradually rotates its owner.
 */
class Rotator extends Component {
    /**
     *
     * @param totalRotation {Number} how much the Entity should be rotated by this Component (in radians)
     * @param easingFn {function} easing function that will smooth out the rotation change (see {@link Easing})
     * @param duration {Number} number of frames after which the rotation should end
     * @param repeatOnce {boolean} if the rotation cycle should start over after it has ended
     */
    constructor(totalRotation, easingFn = Easing.outCubic, duration = 60, repeatOnce = true) {
        super("Rotator")

        this.totalRotation = totalRotation
        this.easingFn = easingFn

        this.currentFrame = 0
        this.totalFrames = duration
        this.repeatOnce = repeatOnce
    }

    update() {
        let progress = this.currentFrame / this.totalFrames,
            factor = this.easingFn(progress)

        this.owner.body.rotation = (this.totalRotation * factor) % (2 * Math.PI)

        if (++this.currentFrame > this.totalFrames) {
            if (this.repeatOnce)
                this.destroy()
            else
                this.currentFrame = 0
        }
    }
}