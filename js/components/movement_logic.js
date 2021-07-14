import Component from "../core/component.js";
import {Vector} from "../math/vector.js";
import {game} from "../core/game.js";
import {PLAYER_MAX_SPEED, PLAYER_VELOCITY} from "../core/game_constants.js";

export {ConstantSpeed, BounceHorizontally, FollowTarget, KeyboardControl, ClipToTarget}

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
        let targetSpeed = this.target.body.pos.clone().subtract(this.owner.body.pos)
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
        let pos = this.owner.body.pos,
            w = this.owner.body.width,
            h = this.owner.body.height;

        if (pos.x < 0 || pos.x + w > game.playArea.width)
            this.speed.x = 0

        if (pos.y < 0 || pos.y + h > game.playArea.height)
            this.speed.y = 0
    }

}

class ClipToTarget extends MovementLogic {
    constructor(target, settings) {
        super("ClipToTarget")

        this.target = target

        this.modeX = settings.modeX || null
        this.modeY = settings.modeY || null

        this.offsetX = this.modeX && settings.offsetX ? settings.offsetX : 0
        this.offsetY = this.modeY && settings.offsetY ? settings.offsetY : 0
    }

    update() {
        if (this.modeX === 'center')
            this.owner.body.centerX = this.target.body.centerX + this.offsetX
        else
            this.owner.body.pos.x = this.target.body.pos.x + this.offsetX

        if (this.modeY === 'center')
            this.owner.body.centerY = this.target.body.centerY + this.offsetY
        else
            this.owner.body.pos.y = this.target.body.pos.y + this.offsetY
    }
}