import {game} from "../core/game.js";
import {BaseEntity} from "../entities/base_entity.js";
import {Body} from "../physics/body.js"
import {PlayerLaser, PlayerOrbitalShield, SimplePlayerBullet} from "../entities/player_bullets.js";
import {
    MULTI_BULLET_W,
    MULTU_BULLET_H,
    PLAYER_BULLET_H,
    PLAYER_BULLET_SPEED,
    PLAYER_BULLET_W,
    PLAYER_FRAMES_PER_BULLET,
} from "../core/game_constants.js";
import {ENTITY_STATE, WEAPON_TYPE} from "../core/enums.js";
import Vector from "../math/vector.js";
import {KeyboardControl} from "../components/movement_logic.js";
import {HealEffect} from "../entities/effects.js";
import Shield from "../entities/shield.js";

/**Represents, well, player
 *
 */
export class Player extends BaseEntity {
    static DIMENSIONS = 70
    static MAX_HEALTH = 100
    static MAX_SPEED = 7
    static VELOCITY = 0.07
    static BOOSTER_DURATION = 300

    shield

    constructor() {
        let initialPos = new Vector((game.playArea.width - Player.DIMENSIONS) / 2,
            (game.playArea.height - Player.DIMENSIONS) / 2)
        super(new Body(initialPos, Player.DIMENSIONS, Player.DIMENSIONS), "player_ship")

        this.health = Player.MAX_HEALTH;

        this.movementLogic = this.components.add(new KeyboardControl(this))

        this.fireState = 0
        this.fireBoosterDuration = 0
        this.weaponType = WEAPON_TYPE.REGULAR
    }

    receiveDamage(damageAmount) {
        this.health -= damageAmount
        if (this.health <= 0) {
            this.destroy()
        }
    }

    heal(healAmount) {
        this.health = Math.min(this.health + healAmount, Player.MAX_HEALTH)
        game.gameObjects.push(new HealEffect(this))
    }

    changeWeapon(weaponType) {
        switch (weaponType) {
            case WEAPON_TYPE.REGULAR:
                this.weaponType = WEAPON_TYPE.REGULAR
                this.fireBoosterDuration = 0

                break
            case WEAPON_TYPE.MULTI:
                this.weaponType = WEAPON_TYPE.MULTI
                this.fireBoosterDuration = Player.BOOSTER_DURATION

                break
            case WEAPON_TYPE.LASER:
                this.weaponType = WEAPON_TYPE.LASER
                this.fireBoosterDuration = Player.BOOSTER_DURATION
                game.gameObjects.push(new PlayerLaser(this.body.pos))

                break
            case WEAPON_TYPE.ORBITAL_SHIELD:
                game.gameObjects.push(new PlayerOrbitalShield())
        }
    }

    fire() {
        switch (this.weaponType) {
            case WEAPON_TYPE.REGULAR:
                let bx = this.body.centerX - PLAYER_BULLET_W / 2,
                    by = this.body.pos.y,
                    bulletBody = new Body(new Vector(bx, by), PLAYER_BULLET_W, PLAYER_BULLET_H),
                    bulletSpeed = new Vector(0, -PLAYER_BULLET_SPEED)

                game.gameObjects.push(
                    new SimplePlayerBullet(bulletBody, "player_regular_bullet", bulletSpeed))

                break

            case WEAPON_TYPE.MULTI:
                for (let i = 0; i < 6; i++) {
                    let bx = this.body.centerX - MULTU_BULLET_H * 1.5 + MULTU_BULLET_H / 3 * i,
                        by = this.body.pos.y - MULTI_BULLET_W / 3 * (2.5 - Math.abs(i - 2.5)),
                        bulletBody = new Body(new Vector(bx, by), MULTI_BULLET_W, MULTU_BULLET_H),
                        bulletSpeed = new Vector((-2.5 + i) * 0.3, -PLAYER_BULLET_SPEED)

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
        if (this.weaponType !== WEAPON_TYPE.REGULAR && --this.fireBoosterDuration <= 0)
            this.changeWeapon(WEAPON_TYPE.REGULAR)

        // If its time to fire, go fire
        if (++this.fireState === PLAYER_FRAMES_PER_BULLET) {
            this.fire()
            this.fireState = 0
        }
    }

    destroy() {
        this.state = ENTITY_STATE.DESTROYED
        game.gameover()
    }

}