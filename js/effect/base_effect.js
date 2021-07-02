import {game} from "../game.js";

export {BaseEffect}

/** Base class for all effects.
 * @param body Body representing effect's position and dimensions
 * @param sprite a series of 100x100 textures packed in a single image */
class BaseEffect {
    constructor(body, sprite) {
        // Copy body => every object has its unique body
        this.body = Object.assign(Object.create(Object.getPrototypeOf(body)), body)
        this.sprite = sprite
        this.texturesInRow = this.sprite.width / 100
        this.texturesInCol = this.sprite.height / 100
        this.state = game.constants.STATE_ACTIVE
        this.frame = 0
    }

    update() {
        this.frame++
        if (this.frame > this.sprite.width * this.sprite.height / 10000) {
            this.state = game.constants.STATE_DESTROYED
        }
    }

    render(ctx) {
        let cellX = this.frame % this.texturesInCol * 100,
            cellY = Math.floor(this.frame / this.texturesInRow) * 100
        ctx.drawImage(this.sprite, cellX, cellY, 100,
            100, this.body.posX, this.body.posY, this.body.width, this.body.height)
    }
}