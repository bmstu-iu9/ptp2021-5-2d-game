import StaticClass from "./static_class.js";

/**
 * This class provides some handy functions regarding randomness as its static properties.
 */
export default class Chance extends StaticClass {
    /**
     * Give a random value ranging from min to max.
     *
     * @param min {Number} the lower bound of the interval
     * @param max {Number} the upper bound of the interval
     * @return {*} a random value ranging from min to max.
     */
    static randomRange(min, max) {
        return Math.round(Math.random() * (max - min)) + min
    }

    /**
     * Tells if the event with probability 1/value has occurred.
     *
     * @param value {Number}
     * @return {boolean} if the event has occurred this time or not.
     */
    static oneIn(value) {
        return Chance.randomRange(1, value) === 1
    }
}
