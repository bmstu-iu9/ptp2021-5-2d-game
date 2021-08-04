import Sequence from "../animations/sequence.js";

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

    /** Unpacks texture from JSON
     *
     * @param atlasJSON
     */
    fromJSON(atlasJSON) {
        let obj = JSON.parse(atlasJSON);

        if (obj.name !== undefined) this.name = obj.name;

        for (let i = 0; i < obj.cells.length; i++)
            this.cells.push(obj.cells[i]);

        if (obj.sequences) { // leave as empty array if no animations
            for (let i = 0; i < obj.sequences.length; i++) {
                let seq = new Sequence(obj.sequences[i].name, obj.sequences[i].cells);

                if (obj.sequences[i].speed !== undefined) seq.speed = obj.sequences[i].speed;
                if (obj.sequences[i].loop !== undefined) seq.loop = obj.sequences[i].loop;

                this.sequences.push(seq);
            }
        }
    }
}