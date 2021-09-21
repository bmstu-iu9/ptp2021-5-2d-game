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
                DAMAGE: 0.5,
            },
            ORBITAL_SHIELD: {
                DIMENSIONS: 70,
                BOSS_DAMAGE: 3,
            }
        },

        DIMENSIONS: 70,
        MAX_HEALTH: 100,
        FIRE_RATE: 8,
        FRICTION: 0.07,
        MAX_SPEED: 7,
        COLLISION_DAMAGE: 10,
    }

export const
    BALANCE = {
        SUPPORT_COOLDOWN: 60,
        ADDITIONAl_HEALTH_COOLDOWN: 450,
        ADDITIONAL_SHIELD_COOLDOWN: 700,
        ADDITIONAL_MULTI_COOLDOWN: 1200,
        BOOSTERS_FREQUENCY: 360,
        CRAZYSPAWNER_COOLDOWN: 15,
        CRAZYSPAWNER_CAPACITY: 40,
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

/**Rewards */
export const
    REWARD = {
        BASE_ENEMY: 50,
        HUNTER_ENEMY: 150,
        LASER_ENEMY: 300,
        BASE_BOSS: 500,
        SPINNING_BOSS: 3000
    }
