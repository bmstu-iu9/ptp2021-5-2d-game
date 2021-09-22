/**
 * Base class for representation of game object's texture/animation frames list.
 */
export default class TextureAtlas {
    static SINGLE_IMAGE = 0
    static SPRITE_SHEET = 1

    constructor(name, type, image) {
        this.name = name
        this.type = type
        this.image = image

        this.cells = []
        this.sequences = []

        this.cellIndex = 0
    }
}
