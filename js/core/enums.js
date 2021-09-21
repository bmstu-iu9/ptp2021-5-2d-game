export const
    CONTROLS = Object.freeze({
        ARROWS: 0,
        WASD: 1,
        TOUCH: 2,
    }),
    WEAPON_TYPE = Object.freeze({
        REGULAR: 0,
        MULTI: 1,
        LASER: 2,
        ORBITAL_SHIELD: 3,
    }),
    ENTITY_STATE = Object.freeze({
        ACTIVE: 0,
        UNDER_FIRE: 1,
        DESTROYED: 13
    }),
    DESTRUCTION_REASONS = Object.freeze({
        DESTROYED_BY_PLAYER: 0,
        OUT_OF_BOUNDS: 1,
        LIFETIME_ENDED: 2,
        UNDEFINED: 3
    })
