export const
    CONTROLS = Object.freeze({
        ARROWS: 0,
        WASD: 1,
        TOUCH: 2,
    }),
    GAME_STATE = Object.freeze({
        LOADING: 0,
        MENU: 1,
        RUNNING: 2,
        BETWEEN_LEVELS: 3,
        END: 4,
        RESULT: 5
    }),
    WEAPON_TYPE = Object.freeze({
        REGULAR: 0,
        MULTI: 1,
        LASER: 2,
    }),
    ENTITY_STATE = Object.freeze({
        ACTIVE: 0,
        UNDER_FIRE: 1,
        DESTROYED: 13
    })
