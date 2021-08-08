/**This file holds all game balance settings. */

export const
    PLAYER = {
        BULLET: {
            WIDTH: 40,
            HEIGHT: 30,
            SPEED: 10,
            DAMAGE: 3,
        },

        POWERUPS: {
            DURATION: 500,

            SHIELD: {
                SIZE_MULTIPLIER: 2,
            },
            LASER: {
                WIDTH: 30,
                DAMAGE: 1,
            },
            ORBITAL_SHIELD: {
                DIMENSIONS: 70,
                BOSS_DAMAGE: 3,
            }
        },

        DIMENSIONS: 70,
        MAX_HEALTH: 100,
        FIRE_RATE: 10,
        FRICTION: 0.07,
        MAX_SPEED: 7,
        COLLISION_DAMAGE: 10,
    }

/**World */
export const
    BACKGROUND_SPEED = 2,
    ORB_SPEED = 2

/**Enemies */
export const
    SHOOTING_ENEMY_FIRE_RATE = 150,
    LASER_ENEMY_FIRE_RATE = 140,
    SPINNING_BOSS_FIRE_RATE = 7,
    ENEMY_HAUNTING_BULLET_SPEED = 4,
    ENEMY_HAUNTING_BULLET_VELOCITY = 0.9;
