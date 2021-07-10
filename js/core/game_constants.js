/**This file holds all game balance settings. */

/**Player constants */
export const
    PLAYER_HEALTH = 100,
    PLAYER_ACCELERATION = 1,
    PLAYER_MAX_SPEED = 7,
    PLAYER_VELOCITY = 0.07,
    PLAYER_FRAMES_PER_BULLET = 10,
    PLAYER_BULLET_DAMAGE = 5,
    PLAYER_BASE_COLLISION_DAMAGE = 10,
    PLAYER_DIM = 50, // player width == player height
    PLAYER_BULLET_W = 40,
    PLAYER_BULLET_H = 30,
    MULTI_BULLET_W = 40,
    MULTU_BULLET_H = 30,
    PLAYER_BULLET_SPEED = 10,
    PLAYER_LASER_WIDTH = 30,
    PLAYER_BOOSTER_DURATION = 300;

/**Possible entity states */
export const
    STATE_ACTIVE = 0,
    STATE_UNDER_FIRE = 1,
    STATE_DESTROYED = 13;

/**World */
export const
    BACKGROUND_SPEED = 2;

/**Enemies */
export const
    ENEMY1_FIRE_RATE = 150,
    ENEMY_HAUNTING_BULLET_SPEED = 4,
    ENEMY_HAUNTING_BULLET_VELOCITY = 0.9;
