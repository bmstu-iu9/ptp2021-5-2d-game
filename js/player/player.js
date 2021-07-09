import {game} from "../core/game.js";
import {BaseEntity} from "../entities/base_entity.js";
import {Body} from "../physics/body.js"
import {PlayerBullet, PlayerLaser} from "../entities/player_bullets.js";
import {
    MULTI_BULLET_W,
    MULTU_BULLET_H,
    PLAYER_BOOSTER_DURATION,
    PLAYER_BULLET_H,
    PLAYER_BULLET_SPEED,
    PLAYER_BULLET_W,
    PLAYER_DIM,
    PLAYER_FRAMES_PER_BULLET,
    PLAYER_HEALTH,
    PLAYER_MAX_SPEED,
    PLAYER_VELOCITY,
    STATE_DESTROYED
} from "../core/game_constants.js";
import {Point} from "../math/point.js";
import {Vector} from "../math/vector.js";
import {WEAPON_TYPE} from "../core/enums.js";

/**Represents, well, player
 *
 */
export class Player extends BaseEntity {
    constructor() {
        let initialPos = new Point((game.playArea.width - PLAYER_DIM) / 2, (game.playArea.height - PLAYER_DIM) / 2)
        super(new Body(initialPos, PLAYER_DIM, PLAYER_DIM), game.assets["player_ship"])
        this.health = PLAYER_HEALTH;

        this.fireState = 0
        this.fireBoosterDuration = 0
        this.weaponType = WEAPON_TYPE.REGULAR

        this.shieldSprite = game.assets["player_shield"]
        this.shieldAddSize = 10;
        this.shieldRotation = 0;
        this.dShieldSize = 0.2;
    }

    receiveDamage(damageAmount) {
        this.health -= damageAmount
        if (this.health <= 0) {
            this.destroy()
        }
    }

    heal(healAmount) {
        this.health = Math.min(this.health + healAmount, PLAYER_HEALTH)
    }

    changeWeapon(weaponType) {
        switch (weaponType) {
            case WEAPON_TYPE.REGULAR:
                this.weaponType = WEAPON_TYPE.REGULAR
                this.fireBoosterDuration = 0

                break
            case WEAPON_TYPE.MULTI:
                this.weaponType = WEAPON_TYPE.MULTI
                this.fireBoosterDuration = PLAYER_BOOSTER_DURATION

                break
            case WEAPON_TYPE.LASER:
                this.weaponType = WEAPON_TYPE.LASER
                this.fireBoosterDuration = PLAYER_BOOSTER_DURATION
                game.gameObjects.push(new PlayerLaser(this.body.pos))

                break
        }
    }

    fire() {
        switch (this.weaponType) {
            case WEAPON_TYPE.REGULAR:
                let bulletBody = new Body(
                    new Point(this.body.centerX - PLAYER_BULLET_W / 2, this.body.pos.y),
                    PLAYER_BULLET_W, PLAYER_BULLET_H, new Vector(0, -PLAYER_BULLET_SPEED))
                game.gameObjects.push(new PlayerBullet(bulletBody, game.assets["player_regular_bullet"]))

                break

            case WEAPON_TYPE.MULTI:
                for (let i = 0; i < 6; i++) {
                    let bx = this.body.centerX - MULTU_BULLET_H * 1.5 + MULTU_BULLET_H / 3 * i,
                        by = this.body.pos.y - MULTI_BULLET_W / 3 * (2.5 - Math.abs(i - 2.5))

                    let bulletBody = new Body(new Point(bx, by), MULTI_BULLET_W, MULTU_BULLET_H,
                        new Vector((-2.5 + i) * 0.3, -PLAYER_BULLET_SPEED))

                    game.gameObjects.push(new PlayerBullet(bulletBody, game.assets["player_multi_bullet"], 5))
                }

                break

            case WEAPON_TYPE.LASER:
                break
        }
    }

    preUpdate() {
        // If booster is over, switch to regular weapon
        if (this.weaponType !== WEAPON_TYPE.REGULAR && --this.fireBoosterDuration <= 0)
            this.changeWeapon(WEAPON_TYPE.REGULAR)

        // If its time to fire, go fire
        if (++this.fireState === PLAYER_FRAMES_PER_BULLET) {
            this.fire()
            this.fireState = 0
        }
    }

    calculateMovement() {
        // Calculate coordinates change
        let acceleration = new Vector(game.isPressed.moveRight - game.isPressed.moveLeft,
            game.isPressed.moveDown - game.isPressed.moveUp)

        acceleration.length = PLAYER_MAX_SPEED
        this.body.speed.lerp(acceleration, PLAYER_VELOCITY).limit(PLAYER_MAX_SPEED)

        let newPos = this.body.pos.clone().moveBy(this.body.speed)
        if (newPos.x < 0 || newPos.y < 0 || newPos.x + PLAYER_DIM > game.playArea.width || newPos.y + PLAYER_DIM > game.playArea.height) {
            this.body.speed.x = this.body.speed.y = 0
        }
    }

    render(ctx) {
        // Render ship
        ctx.drawImage(this.sprite, this.body.pos.x, this.body.pos.y, this.body.width, this.body.height);

        ctx.drawImage(this.shieldSprite, this.body.pos.x - this.shieldAddSize / 2,
            this.body.pos.y - this.shieldAddSize / 2,
            this.body.width + this.shieldAddSize, this.body.height + this.shieldAddSize)
        this.shieldAddSize += this.dShieldSize
        this.shieldRotation++
        if (this.shieldAddSize > 17 || this.shieldAddSize < 10) {
            this.dShieldSize = -this.dShieldSize;
        }
    }

    destroy() {
        this.state = STATE_DESTROYED
        game.reset()
    }

}