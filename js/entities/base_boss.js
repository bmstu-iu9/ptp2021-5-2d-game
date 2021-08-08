import {BaseEnemy} from "./base_enemy.js";
import AssetsManager from "../core/assets_manager.js";
import {ExplosionEffect} from "./effects.js";

export {
    BaseBoss
}

/**
 * Base class for every boss.
 */
class BaseBoss extends BaseEnemy {
    constructor(body, atlasName, health, damage = 100, hpBarWidth = body.width * 0.6) {
        super(body, atlasName, health, damage);
        this.fullHealth = health
        this.fullBarWidth = hpBarWidth
        this.hpBarPos = this.body.pos.clone()
        this.hpBarPos.x += (body.width - hpBarWidth) / 2
        this.hpBarPos.y += this.body.height
        this.lastHBarWidth = this.fullBarWidth
    }

    get destructionEffect() {
        return new ExplosionEffect(this, 'explosion_boss', 1200, 1.2)
    }

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
