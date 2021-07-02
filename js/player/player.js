import {game} from "../game.js";
import {BaseEntity} from "../entities/base_entity.js";
import {Bullet} from "../entities/bullet.js";

export {
    Player
}

/** Represents, well, player */
class Player extends BaseEntity {
    constructor() {
        super(300, 300, 0, 0, game.constants.playerDim, game.constants.playerDim, game.assets["playerSprite"]);
        this.health = 100;
        this.fireState = 0;
    }

    preUpdate() {
        this.fireState++;
        if (this.fireState === game.constants.playerFramesPerBullet) {
            this.fireState = 0
            game.entites.push(new Bullet(this.centerX - game.constants.bulletWidth / 2, this.posY, false))
        }
    }

    calculateMovement() {
        // Calculate coordinates change
        if (game.isPressed.left && this.dx > -game.constants.playerMaxSpeed) {
            this.dx -= game.constants.playerAcceleration
        }
        if (game.isPressed.right && this.dx < game.constants.playerMaxSpeed) {
            this.dx += game.constants.playerAcceleration
        }
        if (game.isPressed.down && this.dy < game.constants.playerMaxSpeed) {
            this.dy += game.constants.playerAcceleration
        }
        if (game.isPressed.up && this.dy > -game.constants.playerMaxSpeed) {
            this.dy -= game.constants.playerAcceleration
        }

        // Apply velocity
        this.dx *= game.constants.playerVelocity
        this.dy *= game.constants.playerVelocity

        // Check bounds
        if (this.posX + this.dx < 0 || this.posX + this.width + this.dx > game.viewport.width) {
            this.dx = 0;
        }
        if (this.posY + this.dy < 0 || this.posY + this.height + this.dy > game.viewport.height) {
            this.dy = 0;
        }
    }

    render(ctx) {
        ctx.beginPath();
        ctx.arc(this.posX + 25, this.posY + 25, 30, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'rgba(112,213,229,0.5)';
        ctx.fill();
        ctx.drawImage(this.sprite, this.posX, this.posY, 50, 50)
    }

}