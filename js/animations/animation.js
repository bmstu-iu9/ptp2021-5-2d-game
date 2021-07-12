import Signal from "../core/signal.js";

/**
 * An Animation contains info about single animation that is played using AnimationManager.
 */
export default class Animation {
    /**
     *
     * @param name the name of this Animation
     * @param sequence the sequence that this animation will be using
     * @param parent the AnimationManager which manages this animation
     */
    constructor(name, sequence, parent) {
        this.name = name
        this._sequence = sequence
        this._loop = sequence.loop
        this._parent = parent

        this.frameIndex = 0
        this._speed = sequence.speed

        this.onComplete = new Signal()
    }

    get loop() {
        return this._loop
    }

    set loop(value) {
        this._loop = value
    }

    get length() {
        return this._sequence.cells.length
    }

    get currentCell() {
        return this._sequence.cells[this.frameIndex]
    }

    _start(index = null) {
        if (index !== null) {
            this.frameIndex = index;
        }

        // If the animation is out of range then start it at the beginning
        if (this.frameIndex >= this.length - 1 || this.frameIndex < 0) {
            this.frameIndex = 0;
        }

        this._isPlaying = true
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

        this.frameIndex++

        if (this._loop) {
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