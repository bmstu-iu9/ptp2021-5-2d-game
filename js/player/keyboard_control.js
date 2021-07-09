import {game} from "../core/game.js";
import {WEAPON_TYPE} from "../core/enums.js";

export {configureKeyWatchers}

/**Hooks "keydown" and "keyup" events so that engine always knows which
 * key is currently pressed*/
function configureKeyWatchers() {
    let moveLeft = false,
        moveUp = false,
        moveRight = false,
        moveDown = false;

    document.onkeydown = function (ev) {
        switch (ev.code) {
            case 'KeyA':
            case 'ArrowLeft':
                moveLeft = true
                break
            case 'KeyW':
            case 'ArrowUp':
                moveUp = true
                break
            case 'KeyD':
            case 'ArrowRight':
                moveRight = true
                break
            case 'KeyS':
            case 'ArrowDown':
                moveDown = true
                break
            // Here the cheats go
            case 'F1':
                ev.preventDefault()
                game.player.heal(100)

                break
            case 'F2':
                ev.preventDefault()
                game.player.changeWeapon(WEAPON_TYPE.MULTI)

                break
            case 'F3':
                ev.preventDefault()
                game.player.changeWeapon(WEAPON_TYPE.LASER)

                break
        }
    };

    document.onkeyup = function (ev) {
        switch (ev.code) {
            case 'KeyA':
            case 'ArrowLeft':
                moveLeft = false
                break
            case 'KeyW':
            case 'ArrowUp':
                moveUp = false
                break
            case 'KeyD':
            case 'ArrowRight':
                moveRight = false
                break
            case 'KeyS':
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