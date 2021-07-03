export {
    Body
}

/** Class representing physical position and properties of game object
 * @param posX position on X axis
 * @param posY position on Y axis
 * @param width width of the collider and sprite
 * @param height height of the collider and sprite
 * @param canCollide if body will be checked for collisions; default: true*/
class Body {
    constructor(posX, posY, width, height, canCollide = true) {
        this.posX = posX
        this.posY = posY
        this.width = width
        this.height = height
        this.canCollide = canCollide
    }

    get centerX() {
        return this.posX + this.width / 2
    }

    get centerY() {
        return this.posY + this.height / 2
    }

    /** Multiplies both width and height by the <factor> while
     * keeping the center at the same point.*/
    scale(factor) {
        // Calculate new corner position so the center don't move
        let diffX = Math.floor(this.width * (factor - 1) / 2),
            diffY = Math.floor(this.height * (factor - 1) / 2)
        this.posX -= diffX
        this.posY -= diffY

        this.width *= factor
        this.height *= factor
    }

    collidesWith(other) {
        return this.posX < other.posX + other.width &&
            this.posX + this.width > other.posX &&
            this.posY < other.posY + other.height &&
            this.posY + this.height > other.posY
    }
}