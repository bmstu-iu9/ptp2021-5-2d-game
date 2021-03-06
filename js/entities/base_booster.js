import BaseEntity from "./base_entity.js";
import {ConstantSpeed, FollowTarget} from "../components/movement_logic.js";
import {ORB_SPEED} from "../core/game_constants.js";
import Vector from "../math/vector.js";
import Body from "../physics/body.js";
import Shared from "../util/shared.js";

export {
    BaseBooster,
    HealBooster,
    ShieldBooster,
    MultiBooster
}

/**
 * Base class for Player's boosters.
 */
class BaseBooster extends BaseEntity {
    /**
     *
     * @param body {Body} Body representing physical position and properties
     * @param atlasName {String} name of atlas loaded into AssetsManager
     * @param boosterType {String}
     * @param aimAtPlayer {boolean} if this booster should follow the player
     */
    constructor(body, atlasName, boosterType, aimAtPlayer = false) {
        super(body, atlasName)
        this.boosterType = boosterType
        this.movementLogic = this.components.add(new ConstantSpeed(new Vector(0, ORB_SPEED)))

        if (aimAtPlayer) {
            this.movementLogic = this.components.replaceComponent('ConstantSpeed',
                new FollowTarget(Shared.player, 7, 0.1))
        }
    }
}

/**
 * Booster that provides healing effect.
 * <p>Healing amount is controlled by {@link PLAYER.HEALING_AMOUNT}.
 */
class HealBooster extends BaseBooster {
    /**
     *
     * @param aimAtPlayer {Boolean} if this booster should chase player
     */
    constructor(aimAtPlayer = false) {
        super(new Body(new Vector(), 50, 50), 'heal_orb', 'heal', aimAtPlayer)
    }
}

/**
 * Booster that changes Player's weapon to WEAPON_TYPE.MULTI.
 */
class MultiBooster extends BaseBooster {
    /**
     *
     * @param aimAtPlayer {Boolean} if this booster should chase player
     */
    constructor(aimAtPlayer = false) {
        super(new Body(new Vector(), 50, 50), 'orbital_shield_orb', 'orbital_shield', aimAtPlayer)
    }
}

/**
 * Booster that provides Player with Shield.
 */
class ShieldBooster extends BaseBooster {
    /**
     *
     * @param aimAtPlayer {Boolean} if this booster should chase player
     */
    constructor(aimAtPlayer = false) {
        super(new Body(new Vector(), 50, 50), 'shield_orb', 'shield', aimAtPlayer)
    }
}
