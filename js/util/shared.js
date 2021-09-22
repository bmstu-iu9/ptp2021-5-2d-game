import StaticClass from "./static_class.js";

/**
 * This class provides some properties which are commonly used throughout the game
 */
export default class Shared extends StaticClass {
    /**
     * Link to the game's Player
     * @type {Player}
     */
    static player
    /**
     * The width of the game area
     * @type {Number}
     */
    static gameWidth
    /**
     * The height of the game area
     * @type {Number}
     */
    static gameHeight
    /**
     * The value which tells how fast should entities move compared to the normal speed.
     * This value increases as the Player gains more score.
     * @type {number}
     */
    static speedMultiplier = 1
}
