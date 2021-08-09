import Lifetime from "../components/lifetime.js";
import Easing from "../util/easing.js";
import BaseEntity from "./base_entity.js";
import {ClipToTarget} from "../components/movement_logic.js";
import {PLAYER} from "../core/game_constants.js";

/**
 * <p>Player's shield.
 * <p>The Shield is attached to Player and protects Player from any damage.
 *
 */
export default class Shield extends BaseEntity {
    static IN_OUT_DURATION = 90 // shield spawn and destruction opacity animation duration

    /**
     *
     * @param owner a BaseEntity to apply this Shield to
     */
    constructor(owner) {
        super(owner.body.clone().scale(PLAYER.POWERUPS.SHIELD.SIZE_MULTIPLIER), "shield_animation")

        this.owner = owner
        this.owner.shield = this

        this.movementLogic = this.components.add(
            new ClipToTarget(owner, ClipToTarget.MODE_CENTER, ClipToTarget.MODE_CENTER))
        this.lifetime = this.components.add(new Lifetime(PLAYER.POWERUPS.DURATION))
    }

    /**
     * <p>Extend this Shield's lifetime.
     * <p>If Player receive a "shield" power-up and he already has an active Shield, this method
     * should be used to extend an existing Shield's lifetime instead of creating a duplicate.
     */
    extend() {
        this.lifetime.remaining = PLAYER.POWERUPS.DURATION - Shield.IN_OUT_DURATION
    }

    update() {
        super.update()

        if (this.lifetime.remaining >= PLAYER.POWERUPS.DURATION - Shield.IN_OUT_DURATION)
            this.opacity = Easing.inOutCubic(
                (PLAYER.POWERUPS.DURATION - this.lifetime.remaining) / Shield.IN_OUT_DURATION)
        else if (this.lifetime.remaining <= Shield.IN_OUT_DURATION)
            this.opacity = Easing.inOutCubic(this.lifetime.remaining / Shield.IN_OUT_DURATION)
        else
            this.opacity = 1
    }

    destroy() {
        super.destroy()
        delete this.owner["shield"]
    }
}
