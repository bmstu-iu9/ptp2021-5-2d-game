import {BaseEnemy} from "./base_enemy.js";
import {game} from "../core/game.js";

export {
    BaseBoss
}

/**Base class for every boss.
 *
 */
class BaseBoss extends BaseEnemy {
    constructor(body, atlas, health, damage = 100) {
        super(body, atlas, health, damage);
        this.fullHealth = health
        this.fullBarWidth = 560
        this.lastHBarWidth = this.fullBarWidth
    }

    draw(ctx) {

        // Draw boss sprite
        let cell = this.atlas.cells[this.cellIndex]
        ctx.drawImage(this.atlas.image, cell.x, cell.y, cell.w, cell.h, this.body.pos.x, this.body.pos.y,
            this.body.width, this.body.height)

        // Draw HP bar
        ctx.drawImage(game.assets.textures["player_hp_bar_back"].image, game.viewport.width/2 - this.fullBarWidth/2, 20, 574, 36)

        let barW = this.fullBarWidth * this.health / this.fullHealth,
            diff = barW - this.lastHBarWidth
        if (diff !== 0) {
            barW = this.lastHBarWidth + diff * 0.1;
            this.lastHBarWidth = barW
        }

        ctx.drawImage(game.assets.textures["boss_hp_bar"].image, 0, 0, 260, 20, game.viewport.width/2 - this.fullBarWidth/2 + 7, 28, barW, 20)

    }

    receiveDamage(amount) {
        this.health -= amount
        if (this.health <= 0) {
            this.destroy()
        }
    }

}
