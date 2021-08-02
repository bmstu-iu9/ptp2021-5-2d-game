import {BaseBoss} from "./base_boss.js";
import {game} from "../core/game.js";
import {Spin} from "../components/movement_logic.js";

export {
    LaserBoss
}

class LaserBoss extends BaseBoss {
    constructor(body, atlas, health, damage = 10, hpBarWidth = body.width*0.6) {
        super(body, atlas, health, damage, hpBarWidth);
        this.movementLogic = this.components.add(new Spin(this, 0.01))
    }
}
