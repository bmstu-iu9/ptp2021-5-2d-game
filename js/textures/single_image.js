import TextureAtlas from "./texture_atlas.js";

/**
 * This class represents the texture of static(non-animated) game object.
 */
export default class SingleImage extends TextureAtlas {
    constructor(name, image, width, height, offsetX, offsetY) {
        super(name, TextureAtlas.SINGLE_IMAGE, image)
        this.width = width || image.width
        this.height = height || image.height
        this.offsetX = offsetX || 0
        this.offsetY = offsetY || 0

        this.cells = this.generateAtlasCells()
    }

    generateAtlasCells() {
        return [{x: this.offsetX, y: this.offsetY, w: this.width, h: this.height}]
    }
}
