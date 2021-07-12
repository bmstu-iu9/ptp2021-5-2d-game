import TextureAtlas from "./texture_atlas.js";

const SINGLE_IMAGE = 0

export default class SingleImage extends TextureAtlas {
    constructor(name, image, width, height, offsetX, offsetY) {
        super(name, SINGLE_IMAGE, image)
        this.width = width || image.width
        this.height = height || image.height
        this.offsetX = offsetX || 0
        this.offsetY = offsetY || 0

        this.cells = this.generateAtlasCells()
    }

    generateAtlasCells() {
        return [
            {
                x: this.offsetX, y: this.offsetY, w: this.width, h: this.height,
                hitboxes: [{x: 0, y: 0, w: this.width, h: this.height}]
            }
        ]
    }
}