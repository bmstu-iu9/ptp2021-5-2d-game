import Body from "../../physics/body.js";
import Vector from "../../math/vector.js";
import {BaseEnemy} from "../../entities/base_enemy.js";
import {GAME_STATE, WEAPON_TYPE} from "../enums.js";
import Chance from "../../util/chance.js";
import Shared from "../../util/shared.js";
import {SpinningBoss} from "../../entities/spinning_boss.js";
import PlayerSatisfactionModule from "./player_satisfaction.js";
import RegularSpawner from "./regular_spawner.js";
import CrazySpawner from "./crazy_spawner.js";

const possible_enemy_caps = [7, 10, 17, 25]

/**
 * This is a level manager.
 */
export default class InfiniteModeManager {
    constructor(game) {
        this.game = game

        this.enemiesSpawned = 0
        this.enemiesKilled = 0
        this.isBossFight = false

        this.score = 0
        this.currentLevelIndex = 0
        this.maxEnemiesCount = possible_enemy_caps[0]

        this.playerSatisfactionModule = new PlayerSatisfactionModule(this)
        this.crazySpawner = new CrazySpawner(this)
        this.regularSpawner = new RegularSpawner(this)
        this.regularSpawner.activate()

        Shared.player.onWeaponChanged.addListener(this.weaponChangedHandler, this)
    }

    /**
     * Get the number of enemies alive.
     *
     * @return {number} the number of enemies alive.
     */
    get enemiesActive() {
        return this.enemiesSpawned - this.enemiesKilled
    }

    enemyKilledHandler() {
        this.enemiesKilled++
    }

    /**
     * React to Player changing his weapon. Launch crazy spawner
     *
     * @param weaponType {WEAPON_TYPE} the type of weapon that Player currently has
     */
    weaponChangedHandler(weaponType) {
        if (weaponType === WEAPON_TYPE.LASER || weaponType === WEAPON_TYPE.MULTI) {
            this.crazySpawner.activate()
            this.regularSpawner.isActive = false
        }

    }

    /**
     * Go to the next level.
     * <p>Second level and every 5-th level contains a boss.
     */
    nextLevel() {
        this.game.state = GAME_STATE.BETWEEN_LEVELS
        this.currentLevelIndex++

        this.enemiesKilled = this.enemiesSpawned = 0
        this.maxEnemiesCount = possible_enemy_caps[Chance.randomRange(0, 3)]

        setTimeout(function () {
            this.game.state = GAME_STATE.RUNNING

            if (this.currentLevelIndex % 5 === 4 || this.currentLevelIndex === 1) {
                this.maxEnemiesCount = 1
                this.isBossFight = true

                let w = 200,
                    h = 120,
                    pos = new Vector(Shared.gameWidth / 2 - w / 2, 50),
                    boss = new SpinningBoss(new Body(pos, w, h), 'base_boss', 200, 10)

                boss.onDestroyed.addListener(function () {
                    this.isBossFight = false
                }, this)
                this.spawn(boss)
            }
        }.bind(this), 3000)
    }

    /**
     * Push the passes objects into the game and update statistics.
     */
    spawn() {
        for (let i = 0; i < arguments.length; i++) {
            this.game.gameObjects.push(arguments[i])

            if (arguments[i] instanceof BaseEnemy)
                this.enemiesSpawned++
        }
    }

    /**
     * Update all modules.
     */
    update() {
        if (this.game.state !== GAME_STATE.RUNNING || this.isBossFight)
            return

        this.crazySpawner.update()
        this.playerSatisfactionModule.update()
        this.regularSpawner.update()

        if (this.score > 3000)
            Shared.speedMultiplier = 1 + this.score / 45000

        if (this.enemiesKilled >= this.maxEnemiesCount)
            this.nextLevel()
    }
}
