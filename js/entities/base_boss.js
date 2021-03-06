import {BaseEnemy} from "./base_enemy.js";
import AssetsManager from "../core/assets_manager.js";
import {ExplosionEffect} from "./effects.js";
import {REWARD} from "../core/game_constants.js";

export {
    BaseBoss
}

/**
 * Base class for every boss.
 */
class BaseBoss extends BaseEnemy {
    constructor(body, atlasName, health, damage = 100, reward = REWARD.BASE_BOSS) {
        super(body, atlasName, health, damage, reward);
        this.fullHealth = health
        this.fullBarWidth = Math.min(body.width * 0.6, 120)
        this.hpBarPos = this.body.pos.clone()
        this.hpBarPos.x += (body.width - this.fullBarWidth) / 2
        this.hpBarPos.y += this.body.height
        this.lastHBarWidth = this.fullBarWidth
    }

    get destructionEffect() {
        return new ExplosionEffect(this, 'explosion_boss', 1800, 1.5)
    }

    /**
     * Draw this boss's HP bar.
     *
     * @param ctx {CanvasRenderingContext2D} canvas context passed by Game.render()
     */
    drawHpBar(ctx) {
        this.hpBarPos = this.body.pos.clone()
        this.hpBarPos.x += (this.body.width - this.fullBarWidth) / 2
        this.hpBarPos.y += this.body.height
        let barW = this.fullBarWidth * this.health / this.fullHealth,
            diff = barW - this.lastHBarWidth
        if (diff !== 0) {
            barW = this.lastHBarWidth + diff * 0.1;
            this.lastHBarWidth = barW
        }

        ctx.drawImage(AssetsManager.textures["boss_hp_bar"].image, 0, 0, 260, 20, this.hpBarPos.x, this.hpBarPos.y + 11,
            barW, 7)
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
