import {game} from "../core/game.js";
import BaseEntity from "../entities/base_entity.js";
import Body from "../physics/body.js"
import {PlayerLaser, PlayerOrbitalShield, SimplePlayerBullet} from "../entities/player_bullets.js";
import {PLAYER} from "../core/game_constants.js";
import {ENTITY_STATE, WEAPON_TYPE} from "../core/enums.js";
import Vector from "../math/vector.js";
import {KeyboardControl} from "../components/movement_logic.js";
import {HealEffect} from "../entities/effects.js";
import Shield from "../entities/shield.js";

/**
 * Represents, well, player :D
 */
export class Player extends BaseEntity {
    shield

    constructor() {
        let initialPos = new Vector((game.playArea.width - PLAYER.DIMENSIONS) / 2,
            (game.playArea.height - PLAYER.DIMENSIONS) / 2)
        super(new Body(initialPos, PLAYER.DIMENSIONS, PLAYER.DIMENSIONS), "player_ship")

        this.health = PLAYER.MAX_HEALTH;

        this.movementLogic = this.components.add(new KeyboardControl(PLAYER.FRICTION, PLAYER.MAX_SPEED))

        this.fireState = 0
        this.fireBoosterDuration = 0
        this.currentWeaponType = WEAPON_TYPE.REGULAR
        this.defaultWeaponType = WEAPON_TYPE.REGULAR
    }

    applyShield() {
        if (this.hasOwnProperty("shield") && this.shield instanceof Shield) {
            this.shield.extend()
            return
        }

        this.shield = new Shield(this)
        game.gameObjects.push(this.shield)
    }

    receiveDamage(damageAmount) {
        if (this.shield)
            return

        this.health -= damageAmount
        if (this.health <= 0) {
            this.health = 0
            this.destroy()
        }
    }

    heal(healAmount) {
        this.health = Math.min(this.health + healAmount, PLAYER.MAX_HEALTH)
        game.gameObjects.push(new HealEffect(this))
    }

    changeWeapon(weaponType, permanent = false) {
        if (permanent) {
            this.defaultWeaponType = weaponType
        }
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

                break
            case WEAPON_TYPE.ORBITAL_SHIELD:
                game.gameObjects.push(new PlayerOrbitalShield())
        }
    }

    fire() {
        switch (this.currentWeaponType) {
            case WEAPON_TYPE.REGULAR:
                let bx = this.body.centerX - PLAYER.BULLET.WIDTH / 2,
                    by = this.body.pos.y,
                    bulletBody = new Body(new Vector(bx, by), PLAYER.BULLET.WIDTH, PLAYER.BULLET.HEIGHT),
                    bulletSpeed = new Vector(0, -PLAYER.BULLET.SPEED)

                game.gameObjects.push(
                    new SimplePlayerBullet(bulletBody, "player_regular_bullet", bulletSpeed))

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
