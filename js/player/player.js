import {game} from "../core/game.js";
import BaseEntity from "../entities/base_entity.js";
import Body from "../physics/body.js"
import {PlayerLaser, PlayerOrbitalShield, SimplePlayerBullet} from "../entities/player_bullets.js";
import {PLAYER} from "../core/game_constants.js";
import {ENTITY_STATE, GAME_STATE, WEAPON_TYPE} from "../core/enums.js";
import Vector from "../math/vector.js";
import {KeyboardControl} from "../components/movement_logic.js";
import {ExplosionEffect, HealEffect} from "../entities/effects.js";
import Shield from "../entities/shield.js";
import SoundManager from "../core/sound_manager.js";
import {FlameRender} from "../components/flame_render.js";
import Shared from "../util/shared.js";
import Signal from "../core/signal.js";

/**
 * Represents, well, player :D
 */
export class Player extends BaseEntity {
    shield

    constructor() {
        let initialPos = new Vector((Shared.gameWidth - PLAYER.DIMENSIONS) / 2,
            (Shared.gameHeight - PLAYER.DIMENSIONS) / 2)
        super(new Body(initialPos, PLAYER.DIMENSIONS, PLAYER.DIMENSIONS), "player_ship")
        this.components.add(new FlameRender("thrust_animation"))

        this.health = PLAYER.MAX_HEALTH;

        this.movementLogic = this.components.add(new KeyboardControl(PLAYER.FRICTION, PLAYER.MAX_SPEED))

        this.fireState = 0
        this.fireBoosterDuration = 0
        this.currentWeaponType = WEAPON_TYPE.REGULAR
        this.defaultWeaponType = WEAPON_TYPE.REGULAR
        this.onWeaponChanged = new Signal()
    }

    get destructionEffect() {
        return new ExplosionEffect(this, 'explosion_orange', 1800, 2)
    }

    /**
     * Give this Player a shield booster.
     * <p>If the player already has an active shield, new shield won't be created. Instead the lifetime of existing
     * shield will be prolonged to the maximum.
     */
    applyShield() {
        if (this.hasOwnProperty("shield") && this.shield instanceof Shield) {
            this.shield.extend()
            return
        }

        this.shield = new Shield(this)
        game.gameObjects.push(this.shield)

        SoundManager.playerSounds("shield")
    }

    /**
     * Reduce this Player's health by given amount.
     * <p>Note: if Player has an active shield, it won't take any damage.
     *
     * @param damageAmount {Number} how much health to deduct from this Player.
     */
    receiveDamage(damageAmount) {
        if (this.shield)
            return

        this.health -= damageAmount
        if (this.health <= 0) {
            this.health = 0
            this.destroy()
        }
    }

    /**
     * Increase this Player's health by given amount.
     * <p>Note: Player's health won't be increased over the maximum amount {@link PLAYER.MAX_HEALTH}.
     *
     * @param healAmount
     */
    heal(healAmount) {
        this.health = Math.min(this.health + healAmount, PLAYER.MAX_HEALTH)
        game.gameObjects.push(new HealEffect(this))

        SoundManager.playerSounds("heal")
    }

    /**
     * Change Player's weapon to the given type.
     *
     * @param weaponType {WEAPON_TYPE} type of weapon to be installed.
     * @param permanent {boolean} if this weapon type has limited duration. If set to false, Player's weapon will be
     * changed to default after {@link PLAYER.POWERUPS.DURATION}
     */
    changeWeapon(weaponType, permanent = false) {
        this.onWeaponChanged.dispatch(weaponType)

        if (permanent)
            this.defaultWeaponType = weaponType

        switch (weaponType) {
            case WEAPON_TYPE.REGULAR:
                this.currentWeaponType = WEAPON_TYPE.REGULAR
                this.fireBoosterDuration = 0

                break
            case WEAPON_TYPE.MULTI:
                this.currentWeaponType = WEAPON_TYPE.MULTI
                this.fireBoosterDuration = PLAYER.POWERUPS.DURATION

                break
            case WEAPON_TYPE.LASER:
                this.currentWeaponType = WEAPON_TYPE.LASER
                this.fireBoosterDuration = PLAYER.POWERUPS.DURATION
                game.gameObjects.push(new PlayerLaser(this.body.pos))
                SoundManager.playerSounds("laser")

                break
            case WEAPON_TYPE.ORBITAL_SHIELD:
                game.gameObjects.push(new PlayerOrbitalShield())
        }
    }

    /**
     * Spawn this Player's bullets according to current weapon type.
     */
    fire() {
        if (game.state === GAME_STATE.BETWEEN_LEVELS)
            return

        switch (this.currentWeaponType) {
            case WEAPON_TYPE.REGULAR:
                let bx = this.body.centerX - PLAYER.BULLET.WIDTH / 2,
                    by = this.body.pos.y,
                    bulletBody = new Body(new Vector(bx, by), PLAYER.BULLET.WIDTH, PLAYER.BULLET.HEIGHT),
                    bulletSpeed = new Vector(0, -PLAYER.BULLET.SPEED)

                game.gameObjects.push(
                    new SimplePlayerBullet(bulletBody, "player_regular_bullet", bulletSpeed))

                SoundManager.playerSounds("player_shot")
                break

            case WEAPON_TYPE.MULTI:
                for (let i = 0; i < 6; i++) {
                    let bx = this.body.centerX + PLAYER.BULLET.HEIGHT * (i / 3 - 1.5),
                        by = this.body.pos.y - PLAYER.BULLET.WIDTH * (2.5 - Math.abs(i - 2.5)) / 3,
                        bulletBody = new Body(new Vector(bx, by), PLAYER.BULLET.WIDTH, PLAYER.BULLET.HEIGHT),
                        bulletSpeed = new Vector((-2.5 + i) * 0.3, -PLAYER.BULLET.SPEED)

                    game.gameObjects.push(
                        new SimplePlayerBullet(bulletBody, "player_multi_bullet", bulletSpeed, 1.5))
                }

                SoundManager.playerSounds("multi_shot")
                break

            case WEAPON_TYPE.LASER:
                break
        }
    }

    update() {
        super.update()
        // If booster is over, switch to regular weapon
        if (this.currentWeaponType !== this.defaultWeaponType && --this.fireBoosterDuration <= 0)
            this.changeWeapon(this.defaultWeaponType)

        // If its time to fire, go fire
        if (++this.fireState === PLAYER.FIRE_RATE) {
            this.fire()
            this.fireState = 0
        }
    }

    destroy() {
        this.state = ENTITY_STATE.DESTROYED
        game.gameover()
    }

}
