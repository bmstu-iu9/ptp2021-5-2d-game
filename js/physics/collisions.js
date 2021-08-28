import {Player} from "../player/player.js";
import {BaseEnemy} from "../entities/base_enemy.js";
import {PLAYER} from "../core/game_constants.js";
import {EnemyBullet} from "../entities/enemy_bullets.js";
import {PlayerBullet, PlayerOrbitalShield} from "../entities/player_bullets.js";
import {BaseBooster} from "../entities/base_booster.js";
import {WEAPON_TYPE} from "../core/enums.js";
import {Force} from "../components/movement_logic.js";
import {BaseBoss} from "../entities/base_boss.js";
import Shield from "../entities/shield.js";
import Vector from "../math/vector.js";
import Easing from "../util/easing.js";
import {LightningEffect} from "../entities/effects.js";
import Lifetime from "../components/lifetime.js";
import {game} from "../core/game.js";
import {Rotator} from "../components/rotator.js";
import SoundManager from "../core/sound_manager.js";

export function applyCollisionRules(obj1, obj2) {
    for (let rule of collisionRules) {
        if (rule.checkAndRun(obj1, obj2)) {
            break
        }
    }
}

/**Collision rule defines how game objects react to collisions.
 *
 */
class CollisionRule {
    /**
     *
     * @param pred1 function to choose the first object of rule
     * @param pred2 function to choose the second object of rule
     * @param callback function which takes actions if objects match the rule
     */
    constructor(pred1, pred2, callback) {
        this.pred1 = pred1
        this.pred2 = pred2
        this.collisionCallback = callback
    }

    /**Checks if passed objects match the predicates. If true, runs the collision callback.
     *
     * @param obj1 first gameObject
     * @param obj2 second gameObject
     * @returns {boolean} if objects match the rule or not
     */
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
    new CollisionRule(isPlayer, isBoss, function (player, boss) {
        let forceDirection = player.body.pos.clone().subtract(boss.body.pos),
            forceLength = 10,
            forceDuration = 60

        player.components.add(new Rotator(4 * Math.PI, Easing.outCubic, forceDuration, true))

        player.components.replaceComponent("KeyboardControl",
            new Force(forceDirection, forceLength, Easing.linear, forceDuration), 0)
        player.components.getComponent("KeyboardControl").speed = new Vector()

        let l = new LightningEffect(boss, player)
        l.lifetime = l.components.add(new Lifetime(forceDuration))
        game.gameObjects.push(l)

        player.receiveDamage(boss.damage * 2 || PLAYER.COLLISION_DAMAGE)
    }),
    new CollisionRule(isPlayer, isEnemy, function (player, enemy) {
        player.receiveDamage(enemy.damage * 2 || PLAYER.COLLISION_DAMAGE)
        enemy.destroy()
    }),
    new CollisionRule(isPlayerBullet, isEnemy, function (myBullet, enemy) {
        myBullet.hit(enemy)
    }),
    new CollisionRule(isEnemyBullet, isPlayer, function (enemyBullet, player) {
        enemyBullet.hit(player)
    }),
    new CollisionRule(isPlayerBullet, isEnemyBullet, function (myBullet, enemyBullet) {
        if (myBullet instanceof PlayerOrbitalShield)
            enemyBullet.destroy()
    }),
    new CollisionRule(isBooster, isPlayer, function (boost, player) {
        boost.destroy()
        SoundManager.gameSounds(boost.boosterType)
        switch (boost.boosterType) {
            case "heal":
                player.heal(25)
                break
            case "laser":
                player.changeWeapon(WEAPON_TYPE.LASER)
                break
            case "shield":
                player.applyShield()
                break
        }
    }),
    new CollisionRule((x) => {
            return (isEnemyBullet(x) || isEnemy(x)) && !isBoss(x)
        },
        (x) => {
            return x instanceof Shield
        },
        function (unfortunateVictim) {
            unfortunateVictim.destroy()
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

function isBooster(x) {
    return x instanceof BaseBooster
}

function isBoss(x) {
    return x instanceof BaseBoss;
}
