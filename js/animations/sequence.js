export default class Sequence {
    /**
     *
     * @param name {string} name of this sequence
     * @param cells {Number[]} cells in this animation
     * @param duration the duration of this sequence (in milliseconds)
     * @param loop {boolean} if animation should play again after it has reached the last frame
     */
    constructor(name, cells, duration = 500, loop = true) {
        this.name = name
        this.cells = cells
        this.speed = Math.floor(duration / cells.length)
        this.loop = loop
    }

    /**
     * Get the duration of this Sequence.
     *
     * @returns {number} the duration of this Sequence
     */
    get duration() {
        return this.speed * this.length
    }

    /**
     * Set the duration of this Sequence to specified value.
     * Note: Changes do not affect the Animations built on this Sequence.
     *
     * @param value desired sequence duration
     */
    set duration(value) {
        this.speed = Math.floor(value / this.length)
    }

    /**
     * Get the length of this Sequence.
     *
     * @returns {number} the length of this Sequence
     */
    get length() {
        return this.cells.length
    }
}