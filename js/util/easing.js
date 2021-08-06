/**
 * <p>This class provides easing functions as static properties.
 * <p>Each easing function accepts current progress (value from 0 to 1) and returns
 * the eased value (also from 0 to 1).
 *
 * <p>For more info on how the corresponding function works visit {@link https://easings.net}.
 *
 * @example Use easing function to describe how the speed should decrease over time.
 * let maxSpeed = 5,
 *     currentFrame = 0,
 *     totalFrames = 60
 *
 * let currentProgress, factor, currentSpeed;
 *
 * for(let i = 0; i < totalFrames; i++){
 *     currentProgress = currentFrame / totalFrames;
 *     factor = 1 - Easing.outExpo(currentProgress)
 *
 *     currentSpeed = maxSpeed * factor
 *     console.log(currentSpeed)
 * }
 */
export default class Easing {
    constructor() {
        throw "You cannot instantiate this class because it's static. To access specific easing function use" +
        " \"Easing.{FUNCTION_NAME}\""
    }

    static inExpo(x) {
        return x === 0 ? 0 : 2 ** (10 * x - 10)
    }

    static outExpo(x) {
        return x === 1 ? 1 : 1 - 2 ** (-10 * x)
    }

    static inOutExpo(x) {
        if (x === 0)
            return 0
        else if (x === 1)
            return 1
        else if (x < 0.5)
            return 2 ** (20 * x - 10) / 2
        else
            return (2 - 2 ** (-20 * x + 10)) / 2
    }

    static inCubic(x) {
        return x ** 3
    }

    static outCubic(x) {
        return 1 - (1 - x) ** 3
    }

    static inOutCubic(x) {
        return x < 0.5 ? 4 * x ** 3 : 1 - (-2 * x + 2) ** 3 / 2
    }
}