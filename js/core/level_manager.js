import Body from "../physics/body.js";
import Vector from "../math/vector.js";
import {BaseEnemy} from "../entities/base_enemy.js";
import {ConstantSpeed} from "../components/movement_logic.js";
import {HunterEnemy, LaserEnemy} from "../entities/armed_enemies.js";
import {BaseBoss} from "../entities/base_boss.js";
import {SpinningBoss} from "../entities/spinning_boss.js";
import {BaseBooster} from "../entities/base_booster.js";
import {game} from "./game.js";
import {WEAPON_TYPE} from "./enums.js";

const GAME_LEVELS = [
    {
        'waves': [],
        'default_weapon': WEAPON_TYPE.REGULAR,
        'boss': 'SpinningBoss',
        'boostersFrequency': 300,
        'allowedBooster': ['heal', 'laser', 'shield'],
    },

    {
        'waves': [
            [
                ['BaseEnemy', 5]
            ],
            [
                ['HunterEnemy', 10]
            ]
        ],
        'default_weapon': WEAPON_TYPE.MULTI,
        'boss': null,
        'boostersFrequency': 300,
        'allowedBooster': ['heal', 'laser', 'shield'],
    },

    {
        'waves': [
            [
                ['BaseEnemy', 5]
            ],
            [
                ['HunterEnemy', 15]
            ]
        ],
        'default_weapon': WEAPON_TYPE.LASER,
        'boss': null,
        'boostersFrequency': 300,
        'allowedBooster': ['heal', 'laser', 'shield'],
    },

    {
        'waves': [
            [
                ['BaseEnemy', 30]
            ]
        ],
        'default_weapon': WEAPON_TYPE.MULTI,
        'boss': null,
        'boostersFrequency': 300,
        'allowedBooster': ['heal', 'laser', 'shield'],
    },

]

function rnd(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export default class LevelManager {
    constructor(index) {
        this.currentLevelIndex = index
        this.currentLevel = GAME_LEVELS[index]
        this.framesTillNextBooster = this.currentLevel.boostersFrequency
        this.score = 0;
        this.currentWave = 0
        this.enemiesTotalNum = 0
        this.bossPushed = false
        this.enemiesKilled = 0
        this.availableEnemies = []
        game.player.changeWeapon(GAME_LEVELS[this.currentLevelIndex].default_weapon, true)

    }


    update() {

        // Push enemies from waves
        if (this.availableEnemies.length === 0 && this.currentWave < this.currentLevel.waves.length) {
            for (let [name, amount] of this.currentLevel.waves[this.currentWave]) {
                this.enemiesTotalNum += amount
                switch (name) {
                    case 'BaseEnemy':
                        for (let i = 0; i < amount; i++) {
                            let body = new Body(new Vector(rnd(30, game.playArea.width), 0), 50, 50),
                                enemy = new BaseEnemy(body, "base_enemy", 10)
                            enemy.movementLogic = enemy.components.add(new ConstantSpeed(new Vector(0, rnd(1, 6))))
                            this.availableEnemies.push(enemy)
                        }
                        break
                    case 'HunterEnemy':
                        for (let i = 0; i < amount; i++) {
                            let body = new Body(new Vector(rnd(30, game.playArea.width), rnd(100, 400)), 50, 50)
                            this.availableEnemies.push(
                                new HunterEnemy(body))
                        }
                        break
                    case 'LaserEnemy':
                        for (let i = 0; i < amount; i++) {
                            let body = new Body(new Vector(rnd(30, game.playArea.width), rnd(60, 300)), 50, 50)
                            this.availableEnemies.push(
                                new LaserEnemy(body))
                        }
                        break
                }
            }

            this.currentWave++
        }

        // Push boss
        if (this.currentWave === this.currentLevel.waves.length && this.currentLevel.boss !== null && !this.bossPushed) {
            this.enemiesTotalNum++

            let body, boss

            switch (this.currentLevel.boss) {
                case 'BaseBoss':
                    body = new Body(new Vector(game.playArea.width / 2 - 100, 20), 200, 150)
                    boss = new BaseBoss(body, "base_boss", 200, 10)

                    this.availableEnemies.push(boss)

                    break
                case 'SpinningBoss':
                    body = new Body(new Vector(game.playArea.width / 2 - 125, 20), 200, 150)
                    boss = new SpinningBoss(body, "base_boss", 200, 10)

                    this.availableEnemies.push(boss)

                    break
            }

            this.bossPushed = true
        }


        // Push boosters
        if (this.framesTillNextBooster === 0 && game.state === game.getStateNumber("STATE_RUNNING")) {
            let boostName = GAME_LEVELS[this.currentLevelIndex].allowedBooster[Math.floor(
                Math.random() * GAME_LEVELS[this.currentLevelIndex].allowedBooster.length)];
            let body = new Body(new Vector(rnd(30, game.playArea.width), 0), 50, 50)
            game.gameObjects.push(new BaseBooster(body, boostName + "_orb", boostName))
            this.framesTillNextBooster = this.currentLevel.boostersFrequency
        }
        this.framesTillNextBooster--


        // Going to the next level
        if (this.enemiesKilled === this.enemiesTotalNum) {
            if (this.currentLevelIndex + 1 < GAME_LEVELS.length)
                this.nextLevel()
            else
                game.gameover()
        }


        // Spawn enemies
        if (rnd(1, 100) > 95 && this.availableEnemies.length > 0 && game.state === game.getStateNumber("STATE_RUNNING")) {
            game.gameObjects.push(this.availableEnemies.shift())
        }
    }

    nextLevel() {
        game.state = game.getStateNumber("STATE_BETWEEN_LEVELS")
        this.currentLevel = GAME_LEVELS[++this.currentLevelIndex]
        this.currentWave = 0
        this.enemiesTotalNum = 0
        this.enemiesKilled = 0
        this.bossPushed = false
        game.player.changeWeapon(GAME_LEVELS[this.currentLevelIndex].default_weapon, true)
        setTimeout(function () {
            game.state = game.getStateNumber("STATE_RUNNING");
        }, 3000)
    }
}
