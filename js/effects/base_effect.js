import {STATE_ACTIVE, STATE_DESTROYED} from "../game_constants.js";

export {BaseEffect}

/**Base class for all effects.
 *
 */
class BaseEffect {
    /**
     *
     * @param body Body representing Effect's position and properties. Will be copied!
     * @param sprite a series of 100x100 textures packed in a single image
     */
    constructor(body, sprite) {
        // Copy body => every object has its unique body
        this.body = Object.assign(Object.create(Object.getPrototypeOf(body)), body)
        this.body.canCollide = false

        this.sprite = sprite
        this.texturesInRow = this.sprite.width / 100
        this.texturesInCol = this.sprite.height / 100
        this.state = STATE_ACTIVE
        this.nextFrame = 0
    }

    update() {
        if (this.nextFrame > this.texturesInRow * this.texturesInCol) {
            this.state = STATE_DESTROYED
        }
        this.nextFrame++
    }

    render(ctx) {
        let cellX = this.nextFrame % this.texturesInCol * 100,
            cellY = Math.floor(this.nextFrame / this.texturesInRow) * 100
        ctx.drawImage(this.sprite, cellX, cellY, 100,
            100, this.body.pos.x, this.body.pos.y, this.body.width, this.body.height)
    }
}