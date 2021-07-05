import {Vector} from "../math/vector.js";

export {
    Body
}

/**Class representing physical pos and properties of game object.
 *
 */
class Body {
    /**
     * @param pos {Point}
     * @param width {number}
     * @param height {number}
     * @param speed {Vector}
     * @param canCollide {boolean}
     * @param rotation {number}
     */
    constructor(pos, width, height, speed = null, canCollide = true, rotation = 0) {
        this.pos = pos
        this.width = width
        this.height = height
        this.speed = speed || new Vector()
        this.canCollide = canCollide
        this.rotation = rotation
    }

    /**Returns X of the center
     *
     * @returns {number}
     */
    get centerX() {
        return this.pos.x + this.width / 2
    }

    /**Returns Y of the center
     *
     * @returns {number}
     */
    get centerY() {
        return this.pos.y + this.height / 2
    }

    clone() {
        return Object.assign(Object.create(Object.getPrototypeOf(this)), this)
    }

    /**Scales this Body by given factor. Keeps the center at the same point.
     *
     * @param factor value by which to scale
     */
    scale(factor) {
        // Calculate new corner pos so the center don't move
        let diffX = Math.floor(this.width * (factor - 1) / 2),
            diffY = Math.floor(this.height * (factor - 1) / 2)
        this.pos.x -= diffX
        this.pos.y -= diffY

        this.width *= factor
        this.height *= factor
    }

    /**Checks if this Body intersects with other Body.
     *
     * @param other Body to check intersection with
     * @returns {boolean} if two bodies collide or not
     */
    collidesWith(other) {
        return this.pos.x < other.pos.x + other.width &&
            this.pos.x + this.width > other.pos.x &&
            this.pos.y < other.pos.y + other.height &&
            this.pos.y + this.height > other.pos.y
    }
}