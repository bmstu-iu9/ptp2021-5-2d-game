import TextureAtlas from "./texture_atlas.js";
import Sequence from "../animations/sequence.js";

/**
 * This class represents animation frames of animated game object.
 */
export default class SpriteSheet extends TextureAtlas {
    constructor(name, texture, cellWidth, cellHeight, cellsCount, rows, cols, sheetOffsetX, sheetOffsetY, cellOffsetX, cellOffsetY) {
        super(name, TextureAtlas.SPRITE_SHEET, texture)

        this.cellWidth = cellWidth;
        this.cellHeight = cellHeight;

        this.cols = cols || texture.width / cellWidth;
        this.rows = rows || texture.height / cellHeight;
        this.cellsCount = cellsCount || this.cols * this.rows;

        this.sheetOffsetX = sheetOffsetX || 0;
        this.sheetOffsetY = sheetOffsetY || 0;

        this.cellOffsetX = cellOffsetX || 0;
        this.cellOffsetY = cellOffsetY || 0;

        this.generateAtlasCells()
    }

    /**
     * Associate particular frames with cells in spritesheet.
     */
    generateAtlasCells() {
        let cellNumeric = []

        let dx = this.sheetOffsetX,
            dy = this.sheetOffsetY

        let i = 0;

        for (let y = 0; y < this.rows; y++) {
            for (let x = 0; x < this.cols; x++) {

                if (i >= this.cellsCount) continue

                this.cells.push({
                    x: dx,
                    y: dy,
                    w: this.cellWidth,
                    h: this.cellHeight,
                })

                cellNumeric.push(i++)

                dx += this.cellOffsetX + this.cellWidth;
            }
            dx = this.sheetOffsetX
            dy += this.cellOffsetY + this.cellHeight
        }

        this.sequences = [];
        this.sequences.push(new Sequence('default', cellNumeric))
    }
}
