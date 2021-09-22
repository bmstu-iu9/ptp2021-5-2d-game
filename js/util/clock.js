import StaticClass from "./static_class.js";

/**
 * <p>A time management class for the Game.
 *
 * <p>This class is static and provides following static properties:
 *  - {@link currentTimestamp}
 *  - {@link timeElapsed}
 *
 * <p>You should not instantiate this class.
 */
export default class Clock extends StaticClass {
    /**
     * System timestamp on current Game.update() cycle (on current frame)
     * @type {number}
     */
    static currentTimestamp = Date.now()
    /**
     * Time elapsed between current frame and previous frame.
     * @type {number}
     */
    static timeElapsed = 0

    /**
     * Update Clock's internal properties.
     *
     * @param ts {Number} current system timestamp.
     */
    static update(ts) {
        Clock.timeElapsed = ts - Clock.currentTimestamp
        Clock.currentTimestamp = ts
    }
}
