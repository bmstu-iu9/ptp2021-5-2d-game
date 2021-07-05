import {game} from "../game.js";
import {BaseEntity} from "../entities/base_entity.js";
import {Body} from "../physics/body.js"
import {PlayerBullet} from "../entities/player_bullets.js";
import {
    MULTI_BULLET_W,
    MULTU_BULLET_H,
    PLAYER_BULLET_H,
    PLAYER_BULLET_SPEED,
    PLAYER_BULLET_W,
    PLAYER_DIM,
    PLAYER_FRAMES_PER_BULLET,
    PLAYER_HEALTH,
    PLAYER_MAX_SPEED,
    PLAYER_VELOCITY
} from "../game_constants.js";
import {Point} from "../math/point.js";
import {Vector} from "../math/vector.js";

export {
    Player
}

const WEAPON_TYPE_REGULAR = 0,
    WEAPON_TYPE_MULTI = 1,
    WEAPON_TYPE_LASER = 2;

/**Represents, well, player
 *
 */
class Player extends BaseEntity {
    constructor() {
        let initialPos = new Point((game.viewport.width - PLAYER_DIM) / 2, (game.viewport.height - PLAYER_DIM) / 2)
        super(new Body(initialPos, PLAYER_DIM, PLAYER_DIM), game.assets["player_ship"])
        this.health = PLAYER_HEALTH;
        this.fireState = 0;
        this.weaponType = WEAPON_TYPE_MULTI
        this.upgradedShotsRemaining = 30
        this.shieldSprite = game.assets["player_shield"]
        this.shieldAddSize = 10;
        this.dShieldSize = 0.2;
    }

    receiveDamage(amount) {
        this.health -= amount
        if (this.health <= 0) {
            this.destroy()
        }
    }

    fire() {
        if (this.fireState++ !== PLAYER_FRAMES_PER_BULLET)
            return

        // If it's time to fire, create bullets
        let bullets = []
        switch (this.weaponType) {
            case WEAPON_TYPE_REGULAR:
                let bulletBody = new Body(new Point(this.body.centerX - PLAYER_BULLET_W / 2, this.body.pos.y),
                    PLAYER_BULLET_W, PLAYER_BULLET_H, new Vector(0, -PLAYER_BULLET_SPEED))
                bullets.push(new PlayerBullet(bulletBody, game.assets["player_regular_bullet"]));

                break

            case WEAPON_TYPE_MULTI:
                for (let i = 0; i < 6; i++) {
                    let bx = this.body.centerX - MULTU_BULLET_H * 1.5 + MULTU_BULLET_H / 3 * i,
                        by = this.body.pos.y - MULTI_BULLET_W / 3 * (2.5 - Math.abs(i - 2.5))

                    let bulletBody = new Body(new Point(bx, by), MULTI_BULLET_W, MULTU_BULLET_H,
                        new Vector((-2.5 + i) * 0.5, -PLAYER_BULLET_SPEED))

                    bullets.push(new PlayerBullet(bulletBody, game.assets["player_multi_bullet"], 5))
                }

                if (this.upgradedShotsRemaining-- <= 0)
                    this.weaponType = WEAPON_TYPE_REGULAR

                break
        }

        // Spawn bullets in game
        for (let b of bullets) {
            game.gameObjects.push(b)
        }
        this.fireState = 0
    }

    preUpdate() {
        this.fire()
    }

    calculateMovement() {
        // Calculate coordinates change
        let acceleration = new Vector(game.isPressed.right - game.isPressed.left,
            game.isPressed.down - game.isPressed.up)

        acceleration.length = PLAYER_MAX_SPEED
        this.body.speed.lerp(acceleration, PLAYER_VELOCITY).limit(PLAYER_MAX_SPEED)

        let newPos = this.body.pos.clone().moveBy(this.body.speed)
        if (newPos.x < 0 || newPos.y < 0 || newPos.x + PLAYER_DIM > game.playArea.width || newPos.y + PLAYER_DIM > game.playArea.height) {
            this.body.speed.x = this.body.speed.y = 0
        }
    }

    render(ctx) {
        // As player does not rotate throughout game, we 100% don't need to render rotation.
        // It's a bad idea to override this method in other classes.
        // Render shield
        ctx.drawImage(this.shieldSprite, this.body.pos.x - this.shieldAddSize / 2,
            this.body.pos.y - this.shieldAddSize / 2,
            this.body.width + this.shieldAddSize, this.body.height + this.shieldAddSize)
        this.shieldAddSize += this.dShieldSize
        if (this.shieldAddSize > 17 || this.shieldAddSize < 10) {
            this.dShieldSize = -this.dShieldSize;
        }

        // Render ship
        ctx.drawImage(this.sprite, this.body.pos.x, this.body.pos.y, this.body.width, this.body.height)
    }

}