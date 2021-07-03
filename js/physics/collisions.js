import {Player} from "../player/player.js";
import {BaseEnemy} from "../entities/base_enemy.js";
import {PLAYER_BASE_COLLISION_DAMAGE} from "../game_constants.js";
import {EnemyBullet} from "../entities/enemy_bullets.js";
import {PlayerBullet} from "../entities/player_bullets.js";

export function testCollision(obj1, obj2) {
    for (let rule of collisionRules) {
        if (rule.checkAndRun(obj1, obj2)) {
            break
        }
    }
}

/** Collision rule defines how game objects react to collisions.
 * @param pred1 function to choose the first object of rule
 * @param pred2 function to choose the second object of rule
 * @param collisionCallback function which takes actions if objects match
 * the predicate*/
class CollisionRule {
    constructor(pred1, pred2, callback) {
        this.pred1 = pred1
        this.pred2 = pred2
        this.collisionCallback = callback
    }

    /** Checks if passed objects match the predicates.
     *  If match, performs callback and returns true, returns false otherwise */
    checkAndRun(obj1, obj2) {
        let passedTest = false

        if (this.pred1(obj2) && this.pred2(obj1)) {
            [obj1, obj2] = [obj2, obj1]
            passedTest = true
        } else if (this.pred1(obj1) && this.pred2(obj2)) {
            passedTest = true
        }

        if (passedTest) {
            this.collisionCallback(obj1, obj2)
            return true
        }


    }
}

const collisionRules = [
    new CollisionRule(isPlayer, isEnemyBullet, function (player, bullet) {
        player.receiveDamage(bullet.damage)
        bullet.destroy()
    }),
    new CollisionRule(isPlayer, isEnemy, function (player, enemy) {
        player.receiveDamage(enemy.damage * 2 || PLAYER_BASE_COLLISION_DAMAGE)
        enemy.destroy()
    }),
    new CollisionRule(isPlayerBullet, isEnemy, function (bullet, enemy) {
        enemy.receiveDamage(bullet.damage)
        bullet.destroy()
    }),
    new CollisionRule(isEnemyBullet, isPlayer, function (bullet, player) {
        player.receiveDamage(bullet.damage)
        bullet.destroy()
    })
]

function isEnemyBullet(x) {
    return x instanceof EnemyBullet
}

function isPlayerBullet(x) {
    return x instanceof PlayerBullet
}

function isEnemy(x) {
    return x instanceof BaseEnemy
}

function isPlayer(x) {
    return x instanceof Player
}