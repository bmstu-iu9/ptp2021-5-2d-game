import {BaseEntity} from "./base_entity.js";
import {ConstantSpeed} from "../components/movement_logic.js";
import {ORB_SPEED} from "../core/game_constants.js";
import {Vector} from "../math/vector.js";

export {
    BaseBooster
}

/**Base class for boosters.
 *
 */
class BaseBooster extends BaseEntity {
    /**
     *
     * @param body {Body} Body representing physical position and properties
     * @param atlas {TextureAtlas} atlas to be rendered
     * @param boosterType {String}
     */
    constructor(body, atlas, boosterType) {
        super(body, atlas)
        this.boosterType = boosterType
        this.movementLogic = this.components.add(new ConstantSpeed(new Vector(0, ORB_SPEED)))
    }
}