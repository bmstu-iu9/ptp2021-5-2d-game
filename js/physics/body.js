export {
    Body
}

class Body {
    constructor(posX, posY, width, height) {
        this.posX = posX
        this.posY = posY
        this.width = width
        this.height = height
    }

    get centerX() {
        return this.posX + this.width / 2
    }

    get centerY() {
        return this.posY + this.height / 2
    }

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