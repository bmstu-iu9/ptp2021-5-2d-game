import {game} from "../game.js";
import {BaseEntity} from "../entities/base_entity.js";
import {Body} from "../physics/body.js"
import {PlayerBullet} from "../entities/player_bullets.js";
import {
    PLAYER_BULLET_WIDTH,
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

/**Represents, well, player
 *
 */
class Player extends BaseEntity {
    constructor() {
        let initialPos = new Point((game.viewport.width - PLAYER_DIM) / 2, (game.viewport.height - PLAYER_DIM) / 2)
        super(new Body(initialPos, PLAYER_DIM, PLAYER_DIM), game.assets["playerSprite"])
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
            let bulletPos = new Point(this.body.centerX - PLAYER_BULLET_WIDTH / 2, this.body.pos.y)
            game.gameObjects.push(new PlayerBullet(bulletPos))
        }
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