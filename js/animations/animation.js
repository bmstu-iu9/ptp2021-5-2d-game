import Signal from "../core/signal.js";
import Clock from "../util/clock.js";

/**
 * An Animation class contains information about single animation that is controlled by AnimationManager.
 * <p>Note that animations are <b>time-based</b> unlike any other things in the game which are frame-based.
 */
export default class Animation {
    /**
     *
     * @param name {String} the name of this Animation
     * @param sequence {Sequence} the sequence that this animation will be using
     * @param parent {AnimationManager} the AnimationManager which manages this animation
     */
    constructor(name, sequence, parent) {
        this.name = name
        this._sequence = sequence
        this._speed = sequence.speed
        this._parent = parent
        this.loop = sequence.loop

        this.frameIndex = 0
        this._lastFrameTimestamp = Clock.currentTimestamp

        this.onComplete = new Signal()
    }

    /**
     * Get the duration of this Animation.
     *
     * @returns {number} the duration of this Animation
     */
    get duration() {
        return this._speed * this.length
    }

    /**
     * Set the duration of this Animation to the specified value.
     * Note: Changes do not affect the underlying sequence.
     *
     * @param value the required duration of this Animation
     */
    set duration(value) {
        this._speed = Math.floor(value / this.length)
    }

    /**
     * Get length of this Animation.
     *
     * @returns {Number} the number of cells in underlying sequence
     */
    get length() {
        return this._sequence.length
    }

    get currentCell() {
        return this._sequence.cells[this.frameIndex]
    }

    /**
     * Start this Animation.
     *
     * @param index index of the frame in the sequence that is to play. If no provided, Animation will start from
     * where it left off.
     * @private
     */
    _start(index = null) {
        if (index !== null)
            this.frameIndex = index

        // If the animation is out of range then start it at the beginning
        if (this.frameIndex >= this.length - 1 || this.frameIndex < 0)
            this.frameIndex = 0

        this._isPlaying = true
        this._lastFrameTimestamp = Clock.currentTimestamp
    }

    playAt(index) {
        this._start(index)
    }

    play() {
        this.playAt(this.frameIndex)
    }

    stop() {
        if (this._isPlaying)
            this._isPlaying = false
    }

    nextFrame() {
        this.frameIndex++;
        if (this.frameIndex >= this.length)
            this.frameIndex = 0
    }

    prevFrame() {
        this.frameIndex--
        if (this.frameIndex < 0)
            this.frameIndex = this.length - 1
    }

    update() {
        if (!this._isPlaying)
            return

        let frameDelta = Math.trunc(
            ((Clock.currentTimestamp - this._lastFrameTimestamp) / this._speed) % (this.length + 1))
        if (frameDelta === 0)
            return

        this.frameIndex += frameDelta
        this._lastFrameTimestamp = Clock.currentTimestamp

        if (this.loop) {
            if (this.frameIndex < 0)
                this.frameIndex = (this.length + this.frameIndex % this.length) % this.length
            else if (this.frameIndex >= this.length)
                this.frameIndex = this.frameIndex % this.length;

        } else if (this.frameIndex < 0 || this.frameIndex >= this.length) {
            this._parent.stop()
            this.onComplete.dispatch()

            return
        }

        this._parent.updateCellIndex()
    }

    destroy() {
        this._isPlaying = false;
        delete this._sequence;
        delete this._parent;
        delete this.frameIndex;
    }

}
