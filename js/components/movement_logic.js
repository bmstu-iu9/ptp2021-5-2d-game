import Component from "../core/component.js";
import Vector from "../math/vector.js";
import {game} from "../core/game.js";
import Easing from "../util/easing.js";
import Shared from "../util/shared.js";
import Chance from "../util/chance.js";

export {
    ConstantSpeed,
    BounceHorizontally,
    FollowTarget,
    KeyboardControl,
    ClipToTarget,
    SpinAround,
    MoveTowards,
    Force,
    Spin,
    RandomSpin
}

class MovementLogic extends Component {
    constructor(name, maxSpeed) {
        super(name)

        this.speed = new Vector()
        this.maxSpeed = maxSpeed || Infinity
    }

    /**
     * Here the new speed should should be calculated.
     */
    preUpdate() {
        super.preUpdate();
    }

    /**
     * Apply speed to body (recalculate position).
     * Inheritors should not change this method.
     */
    update() {
        super.update()

        this.owner.body.pos.add(this.speed.limit(this.maxSpeed).clone().scale(Shared.speedMultiplier))
    }

    /**
     *
     */
    postUpdate() {
        super.postUpdate();
    }

    /**
     * <p>Prevent Entity from leaving the screen.
     * <p>If you want your Entity to remain on the screen, call stopIfOut() in postUpdate().
     */
    stopIfOut() {
        let pos = this.owner.body.pos,
            w = this.owner.body.width,
            h = this.owner.body.height;

        if (pos.x < 0 || pos.x + w > Shared.gameWidth) {
            this.owner.body.pos.x -= this.speed.x
            this.speed.x = 0
        }

        if (pos.y < 0 || pos.y + h > Shared.gameHeight) {
            this.owner.body.pos.y -= this.speed.y
            this.speed.y = 0
        }
    }
}

class ConstantSpeed extends MovementLogic {
    constructor(speed) {
        super("ConstantSpeed")

        this.speed = speed
    }
}

class BounceHorizontally extends MovementLogic {
    constructor(horizontalSpeed) {
        super("BounceHorizontally")

        this.speed = new Vector(horizontalSpeed, 0)
    }

    postUpdate() {
        if (this.owner.body.pos.x < 0 || this.owner.body.pos.x + this.owner.body.width > Shared.gameWidth)
            this.owner.body.pos.add(this.speed.negate())
    }
}

class FollowTarget extends MovementLogic {
    /**
     *
     * @param target {BaseEntity} a BaseEntity to follow
     * @param speed {Number} speed at which owner will follow target
     * @param angularSpeed {Number} how fast should the speed vector change its angle. Value should be from 0
     * (cannot turn) to 1 (instant turn).
     */
    constructor(target, speed = 5, angularSpeed = 0.065) {
        super("FollowTarget", speed)
        this.target = target

        this.maxAngularSpeed = angularSpeed
    }

    preUpdate() {
        let targetSpeed = this.target.body.center.subtract(this.owner.body.center)
        targetSpeed.length = this.maxSpeed

        this.speed.lerp(targetSpeed, this.maxAngularSpeed)
        this.speed.length = this.maxSpeed
    }
}

class KeyboardControl extends MovementLogic {
    /**
     *
     * @param friction {Number} value describing how fast should the speed vector change. Value should be from 0
     * (no impact on speed) to 1 (instant speed change)
     * @param maxSpeed {Number} maximum speed vector length
     */
    constructor(friction, maxSpeed) {
        super("KeyboardControl", maxSpeed)

        this.friction = friction
    }

    preUpdate() {
        let acceleration = new Vector(game.isPressed.moveRight - game.isPressed.moveLeft,
            game.isPressed.moveDown - game.isPressed.moveUp)

        acceleration.length = this.maxSpeed
        this.speed.lerp(acceleration, this.friction)
    }

    postUpdate() {
        super.stopIfOut()
    }
}

/**
 * Provides "clip" movement logic.
 */
class ClipToTarget extends MovementLogic {
    /**
     * Clip owner's center to owner's center with some offset.
     */
    static MODE_CENTER = 0
    /**
     * Clip owner's pos to owner's pos with some offset.
     */
    static MODE_POS = 1

    /**
     *
     * @param target {BaseEntity} Entity to clip to
     * @param modeX {Number|null} X-axis clipping mode; see {@link MODE_CENTER}, {@link MODE_POS}
     * @param modeY {Number|null} Y-axis clipping mode; see {@link MODE_CENTER}, {@link MODE_POS}
     * @param offsetX {Number} X-axis offset
     * @param offsetY {Number} Y-axis offset
     */
    constructor(target, modeX = null, modeY = null, offsetX = 0, offsetY = 0) {
        super("ClipToTarget")

        this.target = target

        this.modeX = modeX
        this.modeY = modeY

        this.offsetX = offsetX
        this.offsetY = offsetY
    }

    update() {
        if (this.modeX === ClipToTarget.MODE_CENTER)
            this.owner.body.centerX = this.target.body.centerX + this.offsetX
        else if (this.modeX === ClipToTarget.MODE_POS)
            this.owner.body.pos.x = this.target.body.pos.x + this.offsetX

        if (this.modeY === ClipToTarget.MODE_CENTER)
            this.owner.body.centerY = this.target.body.centerY + this.offsetY
        else if (this.modeY === ClipToTarget.MODE_POS)
            this.owner.body.pos.y = this.target.body.pos.y + this.offsetY
    }
}

class SpinAround extends MovementLogic {
    constructor(target, radius, rotationSpeed) {
        super("SpinAround")

        this.target = target
        this.radius = radius
        this.rotationSpeed = rotationSpeed
        this.rotation = Math.PI
    }

    update() {
        this.rotation = (this.rotation + this.rotationSpeed) % 360
        this.owner.body.centerY = this.target.body.centerY + this.radius * Math.sin(this.rotation)
        this.owner.body.centerX = this.target.body.centerX + this.radius * Math.cos(this.rotation)
    }
}

class Spin extends MovementLogic {
    constructor(target, rotationSpeed, name = "Spin") {
        super(name)

        this.target = target
        this.rotationSpeed = rotationSpeed
    }

    update() {
        this.target.body.rotation += this.rotationSpeed
    }
}

class RandomSpin extends Spin {
    constructor(target, rotationSpeed) {
        super(target, rotationSpeed, "RandomSpin")
    }

    update() {
        super.update()

        if (Math.abs(this.target.body.rotation) > Math.PI * 0.45 || Chance.oneIn(500))
            this.rotationSpeed = -this.rotationSpeed
    }
}

class MoveTowards extends MovementLogic {
    constructor(target, speedLength) {
        super("MoveTowards")
        this.target = target
        this.speed = null
        this.speedLength = speedLength
        this.aimed = false
    }

    preUpdate() {
        if (!this.aimed) {
            this.speed = this.target.body.center.subtract(this.owner.body.center)
            this.speed.length = this.speedLength
            this.aimed = true
        }
    }
}

/**
 * Apply some force for the given duration.
 */
class Force extends MovementLogic {
    /**
     *
     * @param direction {Vector} Force direction
     * @param initialForce {Number} initial speed Vector length
     * @param easingFn {function} easing function that will smooth out the decrease in speed (see {@link Easing})
     * @param duration {Number} number of frames after which the speed should decrease to zero
     */
    constructor(direction, initialForce = 10, easingFn = Easing.inOutCubic, duration = 60) {
        super("Force", initialForce)

        this.speed = this.initialSpeed = direction.normalize().scale(initialForce)

        this.easingFn = easingFn
        this.currentFrame = 0
        this.totalFrames = duration
    }

    preUpdate() {
        let progress = this.currentFrame / this.totalFrames,
            factor = 1 - this.easingFn(progress)

        this.speed = this.initialSpeed.clone().scale(factor)

        if (++this.currentFrame > this.totalFrames)
            this.destroy()
    }

    postUpdate() {
        super.stopIfOut()
    }
}
