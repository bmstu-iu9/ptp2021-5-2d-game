import {game} from "../game.js";
import {BaseEntity} from "../entities/base_entity.js";
import {Body} from "../physics/body.js"
import {PlayerBullet} from "../entities/player_bullets.js";
import {
    PLAYER_ACCELERATION,
    PLAYER_BULLET_WIDTH,
    PLAYER_DIM,
    PLAYER_FRAMES_PER_BULLET,
    PLAYER_HEALTH,
    PLAYER_MAX_SPEED,
    PLAYER_VELOCITY
} from "../game_constants.js";

export {
    Player
}

/** Represents, well, player */
class Player extends BaseEntity {
    constructor() {
        super(new Body((game.viewport.width - PLAYER_DIM) / 2, (game.viewport.height - PLAYER_DIM) / 2, PLAYER_DIM,
            PLAYER_DIM),
            0, 0, game.assets["playerSprite"])
        this.health = PLAYER_HEALTH;
        this.fireState = 0;
        this.shieldSprite = game.assets["playerShield"]
        this.shieldAddSize = 10;
        this.dShieldSize = 0.2;
    }

    receiveDamage(amount) {
        this.health -= amount
        if (this.health <= 0) {
            this.destroy()
        }
    }

    preUpdate() {
        this.fireState++;
        if (this.fireState === PLAYER_FRAMES_PER_BULLET) {
            this.fireState = 0
            game.gameObjects.push(
                new PlayerBullet(this.body.centerX - PLAYER_BULLET_WIDTH / 2, this.body.posY))
        }
    }

    calculateMovement() {
        // Calculate coordinates change
        if (game.isPressed.left && this.dx > -PLAYER_MAX_SPEED) {
            this.dx -= PLAYER_ACCELERATION
        }
        if (game.isPressed.right && this.dx < PLAYER_MAX_SPEED) {
            this.dx += PLAYER_ACCELERATION
        }
        if (game.isPressed.down && this.dy < PLAYER_MAX_SPEED) {
            this.dy += PLAYER_ACCELERATION
        }
        if (game.isPressed.up && this.dy > -PLAYER_MAX_SPEED) {
            this.dy -= PLAYER_ACCELERATION
        }

        // Apply velocity
        this.dx *= PLAYER_VELOCITY
        this.dy *= PLAYER_VELOCITY

        // Check bounds
        if (this.body.posX + this.dx < 0 || this.body.posX + this.body.width + this.dx > game.viewport.width) {
            this.dx = 0;
        }
        if (this.body.posY + this.dy < 0 || this.body.posY + this.body.height + this.dy > game.viewport.height) {
            this.dy = 0;
        }
    }

    render(ctx) {
        // As player does not rotate throughout game, we 100% don't need to render rotation.
        // It's a bad idea to override this method in other classes.
        // Render shield
        ctx.drawImage(this.shieldSprite, this.body.posX - this.shieldAddSize / 2,
            this.body.posY - this.shieldAddSize / 2,
            this.body.width + this.shieldAddSize, this.body.height + this.shieldAddSize)
        this.shieldAddSize += this.dShieldSize
        if (this.shieldAddSize > 17 || this.shieldAddSize < 10) {
            this.dShieldSize = -this.dShieldSize;
        }

        // Render ship
        ctx.drawImage(this.sprite, this.body.posX, this.body.posY, this.body.width, this.body.height)
    }

}