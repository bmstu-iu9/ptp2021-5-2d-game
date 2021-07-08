import {BaseEntity} from "./base_entity.js";
import {STATE_DESTROYED} from "../core/game_constants.js";
import {game} from "../core/game.js";

export {
    Boosters
}

/**Base class for boosters.
 *
 */
class Boosters extends BaseEntity {
    /**
     *
     * @param body {Body} Body representing physical position and properties
     * @param sprite sprite to be rendered\
     */
    constructor(body, sprite, booseterType) {
        super(body, sprite)
        this.booseterType = booseterType
    }
    //Switch cases in destroy() is the only difference between boosters (except for sprites and boosterType)
    destroy() {
        this.state = STATE_DESTROYED
        switch (this.booseterType){
            case "heal_orb":
                game.player.health < 75 ? game.player.health += 25 : game.player.health = 100
                break
        }
    }
}