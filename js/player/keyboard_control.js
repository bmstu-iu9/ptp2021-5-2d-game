import {game} from "../core/game.js";

export {configureKeyWatchers}

/**Hooks "keydown" and "keyup" events so that engine always knows which
 * key is currently pressed*/
function configureKeyWatchers() {
    let moveLeft = false,
        moveUp = false,
        moveRight = false,
        moveDown = false;

    document.onkeydown = function (ev) {
        switch (ev.key) {
            case 'a':
            case 'ArrowLeft':
                moveLeft = true
                break
            case 'w':
            case 'ArrowUp':
                moveUp = true
                break
            case 'd':
            case 'ArrowRight':
                moveRight = true
                break
            case 's':
            case 'ArrowDown':
                moveDown = true
                break
        }
    };

    document.onkeyup = function (ev) {
        switch (ev.key) {
            case 'a':
            case 'ArrowLeft':
                moveLeft = false
                break
            case 'w':
            case 'ArrowUp':
                moveUp = false
                break
            case 'd':
            case 'ArrowRight':
                moveRight = false
                break
            case 's':
            case 'ArrowDown':
                moveDown = false
                break
        }
    };

    Object.defineProperty(game.isPressed, 'moveLeft', {
        get: () => {return moveLeft}
    })
    Object.defineProperty(game.isPressed, 'moveUp', {
        get: () => {return moveUp}
    })
    Object.defineProperty(game.isPressed, 'moveRight', {
        get: () => {return moveRight}
    })
    Object.defineProperty(game.isPressed, 'moveDown', {
        get: () => {return moveDown}
    })
}