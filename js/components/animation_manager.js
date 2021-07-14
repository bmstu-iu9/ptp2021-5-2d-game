import Sequence from "../animations/sequence.js";
import Component from "../core/component.js";
import Animation from "../animations/animation.js";

export class AnimationManager extends Component {
    constructor(entity, inheritSequences = true) {
        super(entity, "Animation")
        this.entity = entity
        this._atlas = this.entity.atlas
        this._animations = {}

        //Create all of the default animations.
        if (inheritSequences === true) {
            for (let i = 0; i < this._atlas.sequences.length; i++) {
                this.createFromSequence(this._atlas.sequences[i], false)
            }
        }

        if (this._animations['default']) {
            this.currentAnimation = this._animations['default']
        } else {
            let defaultCells = [];
            for (let i = 0; i < this._atlas.cells.length; i++) {
                defaultCells.push(i);
            }

            this.currentAnimation = this.add('default', defaultCells, 20, true, false)
        }

        this.currentAnimation.play()
    }

    /** Tells if the current Animation is playing.
     *
     * @returns {boolean} if the current Animation is playing
     */
    get isPlaying() {
        return this.currentAnimation.isPlaying
    }

    /**
     * Gets the cell that the current Animation is currently at.
     */
    get currentCell() {
        return this.currentAnimation.currentCell;
    }

    /**
     * Gets the current frame index of the cell in the Sequence that is currently playing.
     *
     * @returns {number}
     */
    get frameIndex() {
        return this.currentAnimation.frameIndex;
    }

    /**
     * Returns the length of the current Animation that is playing.
     *
     * @returns {number} the number of cells in the current Animation
     */
    get length() {
        return this.currentAnimation.length;
    }

    /**
     * Creates a new Animation (by creating a Sequence) that can then be played on this AnimationManager.
     *
     * @param name {string} the name of the animation that is to be created.
     * @param cells {Array} an array of numbers, which are reference to each cell that is to be played in the
     * Animation in order.
     * @param duration {Number} the duration of the animation (in milliseconds).
     * @param loop {boolean} if animation should play again when it has reached the end.
     * @param play {boolean} ff once created the animation should played right away.
     * @param addToAtlas {boolean} if the new Sequence should be added to the TextureAtlas or not.
     * @return {Animation} the Animation that was created.
     */
    add(name, cells, duration, loop = false, play = false, addToAtlas = true) {
        let newSequence = new Sequence(name, cells, duration, loop);
        if (addToAtlas === true) this._atlas.sequences.push(newSequence);

        return this.createFromSequence(newSequence, play);
    }

    /**
     * Creates a new Animation based on a Sequence that is passed.
     * If you pass to this the name of a Animation that already exists, then the previous Animation will be
     * overwritten by a new one.
     *
     * @param sequence {Sequence} the sequence that the Animation is based on.
     * @param play {boolean} if the Animation should played once it has been created
     * @return {Animation} the Animation that was created.
     */
    createFromSequence(sequence, play = false) {
        this._animations[sequence.name] = new Animation(sequence.name, sequence, this);

        if (play) this.play(sequence.name)

        return this._animations[sequence.name]
    }

    /**
     * An internal method used to actually play a Animation at a Index.
     *
     * @param name {string} The name of the animation that is to be switched to.
     * @param index {number} The index of the frame in the Sequence that is to play. If null, then it restarts the
     * animation at the cell it currently is at.
     * @return {Animation} Returns the current Animation that is now playing.
     */
    _play(name, index = -1) {

        this._setCurrentAnimation(name);

        if (index !== -1)
            this.currentAnimation.playAt(index);
        else
            this.currentAnimation.play();

        this.updateCellIndex();
        return this.currentAnimation;
    }

    /**
     * Plays either the current animation or the name of the animation that you pass.
     *
     * @param name{String} The name of the animation you want to play.
     * @param resetTime{Boolean}
     * @return {Animation} Returns the current Animation that is now playing.
     */
    play(name = this.currentAnimation.name, resetTime = true) {
        if (resetTime === false && this.currentAnimation.name === name && this.currentAnimation.isPlaying === true) {
            return this.currentAnimation;
        } else {
            return this._play(name);
        }
    }

    /**
     * Stops the current animation from playing.
     *
     */
    stop() {
        if (this.isPlaying === true) {
            this.currentAnimation.stop();
        }
    }

    /**
     * Resumes the current animation.
     * The animation should have already been paused.
     *
     */
    resume() {
        this.currentAnimation.resume();
    }

    /**
     * Switches to the new animation if you pass a string - animation name; or switches to the specified frame
     * if the number is passed.
     *
     * @param val {string|number} animation name or frame number
     * @param play {boolean} force the animation to play or stop. If null the animation will preserve its state.
     */
    switchTo(val, play) {
        let switched = false
        switch (typeof val) {
            case "string":
                if (this.currentAnimation.name !== val) {
                    this._setCurrentAnimation(val);
                    switched = true;
                }
                break;
            case "number":
                this.currentAnimation.frameIndex = val;
                switched = true;
                break;
        }

        //Play if the dev forced it to OR if the animation was already playing
        if (play || play === undefined && this.isPlaying && switched) this.play();
        if (play === false && this.isPlaying) this.stop();

        this.updateCellIndex();
    }

    /**
     * Makes the current animation go to the next frame. If the animation is at the end of the sequence it then goes back to the start.
     *
     */
    nextFrame() {
        this.currentAnimation.nextFrame();
        this.updateCellIndex();
    }

    /**
     * Makes the current animation go to the prev frame. If the animation is at the start, the animation will go the end of the sequence.
     *
     */
    prevFrame() {
        this.currentAnimation.prevFrame();
        this.updateCellIndex();
    }

    /**
     * Internal method that sets the current animation to an Animation passed.
     *
     * @param name {string} Name of the Animation that is to be switched to.
     * @param inheritFromTexture {boolean} If the animation component should look on the texture atlas for a
     * sequence with that name.
     */
    _setCurrentAnimation(name, inheritFromTexture = true) {

        if (this.currentAnimation.name !== name) {

            if (this.currentAnimation !== null)
                this.currentAnimation.stop()

            if (this._animations[name]) {
                this.currentAnimation = this._animations[name]
            } else if (inheritFromTexture) {
                //Check to see if that animation exists on the atlas.
                //If so create a new version of it.
                for (let i = 0; i < this._atlas.sequences.length; i++) {
                    if (this._atlas.sequences[i].name === name) {
                        this.currentAnimation = this.createFromSequence(this._atlas.sequences[i], false);
                        //this.onChange.dispatch(name, this.currentAnimation);
                    }
                }
            }
        }
    }

    /**
     * Updates the current animation.
     *
     */
    update() {
        if (this.currentAnimation) {
            this.currentAnimation.update();
        }
    }

    /**
     * Returns a Animation that is on this AnimationComponent
     * Does not check to see if that Animation exists or not.
     *
     * @param name {string} The name of the Animation you would like to get.
     * @return {Animation} The Animation that is found. Will be 'undefined' if a Animation with that name did not exist.
     */
    getAnimation(name) {
        return this._animations[name];
    }

    /**
     * An internal method that is used to update the cell index of an entity when an animation says it needs to update.
     *
     */
    updateCellIndex() {
        if (typeof this.currentAnimation !== "undefined") {
            this.entity.cellIndex = this.currentAnimation.currentCell;
            //this.onUpdate.dispatch(this.currentAnimation);
        }
    }

    /**
     * Destroys the animation component and runs the destroy method on all of the animations that it has.
     *
     */
    destroy() {
        for (let animName of this._animations) {
            delete this._animations[name]
        }
        delete this._animations;
        delete this.currentAnimation;
        delete this._atlas;
    }

}