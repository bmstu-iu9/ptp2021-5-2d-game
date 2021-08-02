import {BaseEnemy} from "./base_enemy.js";
import {game} from "../core/game.js";

export {
    BaseBoss
}

/**Base class for every boss.
 *
 */
class BaseBoss extends BaseEnemy {
    constructor(body, atlas, health, damage = 100, hpBarWidth = body.width*0.6) {
        super(body, atlas, health, damage);
        this.fullHealth = health
        this.fullBarWidth = hpBarWidth
        this.hpBarPos = this.body.pos.clone()
        this.hpBarPos.x += (body.width - hpBarWidth)/2
        this.hpBarPos.y += this.body.height
        this.lastHBarWidth = this.fullBarWidth
    }

    drawHpBar(ctx) {
        this.hpBarPos = this.body.pos.clone()
        this.hpBarPos.x += (this.body.width - this.fullBarWidth)/2
        this.hpBarPos.y += this.body.height
        let barW = this.fullBarWidth * this.health / this.fullHealth,
            diff = barW - this.lastHBarWidth
        if (diff !== 0) {
            barW = this.lastHBarWidth + diff * 0.1;
            this.lastHBarWidth = barW
        }
        ctx.drawImage(game.assets.textures["boss_hp_bar"].image, 0, 0, 260, 20, this.hpBarPos.x, this.hpBarPos.y+11, barW, 7)
    }

    render(ctx) {
        this.drawHpBar(ctx)
        super.render(ctx)
    }

    receiveDamage(amount) {
        this.health -= amount
        if (this.health <= 0) {
            this.destroy()
        }
    }

}
