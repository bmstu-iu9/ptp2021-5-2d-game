import {Vector} from "../math/vector.js";

export {
    Body
}

/**Class representing physical pos and properties of game object.
 *
 */
class Body {
    /**
     * @param pos {Vector}
     * @param width {number}
     * @param height {number}
     * @param canCollide {boolean}
     * @param rotation {number}
     */
    constructor(pos, width, height, canCollide = true, rotation = 0) {
        this.pos = pos
        this.width = width
        this.height = height
        this.canCollide = canCollide
        this.rotation = rotation
    }

    /**
     * Get the X-axis coordinate of the center of this body
     *
     * @returns {number}
     */
    get centerX() {
        return this.pos.x + this.width / 2
    }

    /**
     * Set the X-axis coordinate of the center of this body
     *
     */
    set centerX(value) {
        this.pos.x = value - this.width / 2
    }

    /**
     * Get the Y-axis coordinate of the center of this body
     *
     * @returns {number}
     */
    get centerY() {
        return this.pos.y + this.height / 2
    }

    /**
     * Set the Y-axis coordinate of the center of this body
     *
     */
    set centerY(value) {
        this.pos.y = value - this.height / 2
    }

    get center() {
        return new Vector(this.centerX, this.centerY)
    }

    /**
     * Clone this Body.
     *
     * @return {Body} new Body which is identical to this Body
     */
    clone() {
        return new Body(this.pos.clone(), this.width, this.height, this.canCollide, this.rotation)
    }

    /**
     * Scale this Body by given factor.
     * Center is kept at the same point.
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

        return this
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
