import {game} from "../core/game.js";

export {configureKeyWatchers}

/**Hooks "keydown" and "keyup" events so that engine always knows which
 * key is currently pressed*/
function configureKeyWatchers(wasd) {
    game.isPressed = {};

    let left = false, right = false, up = false, down = false;
    let left_key = 37, right_key = 39, up_key = 38, down_key = 40;
    if (wasd){ // check transfer control on wasd
        left_key = 65; right_key = 68; up_key = 87; down_key = 83;
    }
    // Set up `onkeydown` event handler.
    document.onkeydown = function (ev) {
        if (ev.keyCode === right_key) {
            right = true;
        }
        if (ev.keyCode === left_key) {
            left = true;
        }
        if (ev.keyCode === up_key) {
            up = true;
        }
        if (ev.keyCode === down_key) {
            down = true;
        }
    };

    // Set up `onkeyup` event handler.
    document.onkeyup = function (ev) {
        if (ev.keyCode === right_key) {
            right = false;
        }
        if (ev.keyCode === left_key) {
            left = false;
        }
        if (ev.keyCode === up_key) {
            up = false;
        }
        if (ev.keyCode === down_key) {
            down = false;
        }
    };

    // Define getters for each key
    // * Not strictly necessary. Could just return
    // * an object literal of methods, the syntactic
    // * sugar of `defineProperty` is just so much sweeter :)
    Object.defineProperty(game.isPressed, 'left', {
        get: function () {
            return left;
        },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(game.isPressed, 'right', {
        get: function () {
            return right;
        },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(game.isPressed, 'up', {
        get: function () {
            return up;
        },
        configurable: true,
        enumerable: true
    });

    Object.defineProperty(game.isPressed, 'down', {
        get: function () {
            return down;
        },
        configurable: true,
        enumerable: true
    });

}