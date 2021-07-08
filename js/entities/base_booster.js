import {BaseEntity} from "./base_entity.js";

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
     * @param sprite sprite to be rendered\
     */
    //Switch cases in collision rules is the only difference between boosters (except for sprites and boosterType)
    constructor(body, sprite, booseterType) {
        super(body, sprite)
        this.booseterType = booseterType
    }
}