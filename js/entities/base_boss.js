import {BaseEnemy} from "./base_enemy.js";
import {game} from "../core/game.js";

export {
    BaseBoss
}

/**Base class for every boss.
 *
 */
class BaseBoss extends BaseEnemy {
    constructor(body, atlas, health, damage = 100, hpBarWidth = body.width*0.8) {
        super(body, atlas, health, damage);
        this.fullHealth = health
        this.fullBarWidth = hpBarWidth
        this.leftCorner = (game.viewport.width - this.fullBarWidth)/2
        this.lastHBarWidth = this.fullBarWidth
    }

    draw(ctx) {

        // Draw boss sprite
        let cell = this.atlas.cells[this.cellIndex]
        ctx.drawImage(this.atlas.image, cell.x, cell.y, cell.w, cell.h, this.body.pos.x, this.body.pos.y,
            this.body.width, this.body.height)

        // Draw HP bar
        ctx.drawImage(game.assets.textures["boss_hp_bar_back"].image, this.leftCorner, 20, this.fullBarWidth, 36)

        let barW = this.fullBarWidth * this.health / this.fullHealth,
            diff = barW - this.lastHBarWidth
        if (diff !== 0) {
            barW = this.lastHBarWidth + diff * 0.1;
            this.lastHBarWidth = barW
        }

        ctx.drawImage(game.assets.textures["boss_hp_bar"].image, 0, 0, 260, 20, this.leftCorner+this.fullBarWidth*0.03, 28, barW, 20)

    }

    receiveDamage(amount) {
        this.health -= amount
        if (this.health <= 0) {
            this.destroy()
        }
    }

}
