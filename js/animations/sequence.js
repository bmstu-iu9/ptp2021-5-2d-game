export default class Sequence {
    /**
     *
     * @param name{string} name of this sequence
     * @param cells{Number[]} cells in this animation
     * @param speed{Number} the time animation should spend on each frame
     * @param loop{boolean} if animation should play again after it has reached the last frame
     */
    constructor(name, cells, speed = 0.05, loop = true) {
        this.name = name;
        this.cells = cells;
        this.speed = speed;
        this.loop = loop;
    }
}