import BaseEffect from "./base_effect.js";
import {game} from "../core/game.js";
import {ClipToTarget} from "../components/movement_logic.js";

export {ExplosionEffect, HealEffect}

class ExplosionEffect extends BaseEffect {
    constructor(body, atlas) {
        super(body, atlas)
        this.body.scale(2)
    }
}

class HealEffect extends BaseEffect {
    constructor(target) {
        let effectBody = target.body.clone().scale(1.35)
        super(effectBody, game.assets.textures["heal_animation"])

        this.target = target
        this.movementLogic = this.components.add(
            new ClipToTarget(this.target, 'center', 'center', 0, 0))
    }

    draw(ctx) {
        ctx.globalAlpha = 0.75
        let cell = this.atlas.cells[this.cellIndex]
        ctx.drawImage(this.atlas.image, cell.x, cell.y, cell.w, cell.h, this.body.pos.x, this.body.pos.y,
            this.body.width, this.body.height)
        ctx.globalAlpha = 1
    }
}