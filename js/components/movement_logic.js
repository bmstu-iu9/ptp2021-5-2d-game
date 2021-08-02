import Component from "../core/component.js";
import {Vector} from "../math/vector.js";
import {game} from "../core/game.js";
import {PLAYER_MAX_SPEED, PLAYER_VELOCITY} from "../core/game_constants.js";

export {ConstantSpeed, BounceHorizontally, FollowTarget, KeyboardControl, ClipToTarget, SpinAround, MoveTowards, PushAway, Spin}

class MovementLogic extends Component {
    /**
     *
     * @param name Name
     */
    constructor(name) {
        super(name);
        this.speed = new Vector()
    }

    update() {
        this.owner.body.pos.add(this.speed)
    }

    stopIfOut() {
        let pos = this.owner.body.pos,
            w = this.owner.body.width,
            h = this.owner.body.height;

        if (pos.x < 0 || pos.x + w > game.playArea.width)
            this.speed.x = 0

        if (pos.y < 0 || pos.y + h > game.playArea.height)
            this.speed.y = 0
    }
}

class ConstantSpeed extends MovementLogic {
    constructor(speed) {
        super("ConstantMovement")
        this.speed = speed
    }
}

class BounceHorizontally extends MovementLogic {
    constructor(horizontalSpeed) {
        super("BounceHorizontally")

        this.speed = new Vector(horizontalSpeed, 0)
    }

    postUpdate() {
        if (this.owner.body.pos.x < 0 || this.owner.body.pos.x + this.owner.body.width > game.playArea.width)
            this.owner.body.pos.add(this.speed.negate())
    }
}

class FollowTarget extends MovementLogic {
    constructor(target, settings = {}) {
        super("FollowTarget")
        this.target = target

        this.maxSpeed = settings.maxSpeed || 5
        this.turningSpeed = settings.turningSpeed || 0.065
    }

    preUpdate() {
        let targetSpeed = this.target.body.center.subtract(this.owner.body.center)
        targetSpeed.length = this.maxSpeed

        this.speed.lerp(targetSpeed, this.turningSpeed)
        this.speed.length = this.maxSpeed
    }
}

class KeyboardControl extends MovementLogic {
    constructor() {
        super("KeyboardControl");
    }

    preUpdate() {
        let acceleration = new Vector(game.isPressed.moveRight - game.isPressed.moveLeft,
            game.isPressed.moveDown - game.isPressed.moveUp)

        acceleration.length = PLAYER_MAX_SPEED
        this.speed.lerp(acceleration, PLAYER_VELOCITY).limit(PLAYER_MAX_SPEED)
    }
    postUpdate() {
        super.stopIfOut()
    }
}

/**
 * Provides "clip" movement logic.
 *
 */
class ClipToTarget extends MovementLogic {
    constructor(target, modeX = null, modeY = null, offsetX = 0, offsetY = 0) {
        super("ClipToTarget")

        this.target = target

        this.modeX = modeX
        this.modeY = modeY

        this.offsetX = offsetX
        this.offsetY = offsetY
    }

    update() {
        if (this.modeX === 'center')
            this.owner.body.centerX = this.target.body.centerX + this.offsetX
        else if (this.modeX === 'pos')
            this.owner.body.pos.x = this.target.body.pos.x + this.offsetX

        if (this.modeY === 'center')
            this.owner.body.centerY = this.target.body.centerY + this.offsetY
        else if (this.modeY === 'pos')
            this.owner.body.pos.y = this.target.body.pos.y + this.offsetY
    }
}

class SpinAround extends MovementLogic {
    constructor(target, radius, rotationSpeed) {
        super("SpinAround")

        this.target = target
        this.radius = radius
        this.rotationSpeed = rotationSpeed
        //Current angle with target on the center of coordinate system
        //Angle can be a large number, so be careful wit rotation speed and life time of a body
        this.rotation = 0
    }

    update() {
        //Update current angle by adding rotationSpeed. Angle changes due to the change in the current angle.
        //Also, the coordinate system is different from the game coordinate system.
        // But we just transform it into a game coordinate system during calculations.
        this.rotation = (this.rotation + this.rotationSpeed) % 360

        this.owner.body.centerY = this.target.body.centerY + this.radius * Math.sin(this.rotation)
        this.owner.body.centerX = this.target.body.centerX + this.radius * Math.cos(this.rotation)
    }
}

class Spin extends MovementLogic {
    constructor(target, rotation) {
        super("Spin")
        this.target = target
        this.rotation = rotation
    }

    update() {
        this.target.body.rotation += this.rotation
    }
}

class MoveTowards extends MovementLogic {
    constructor(target, speedLength, name = "MoveTowards") {
        super(name)
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

class PushAway extends MoveTowards {
    constructor(target, speedLength) {
        super(target, -speedLength, "PushAway");
    }
    postUpdate() {
        super.stopIfOut()
    }
}
