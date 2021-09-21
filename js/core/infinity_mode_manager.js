import SpawnRegulator from "./spawn_regulator.js";
import Body from "../physics/body.js";
import Vector from "../math/vector.js";
import {BaseEnemy} from "../entities/base_enemy.js";
import {ConstantSpeed} from "../components/movement_logic.js";
import {ShootingEnemy} from "../entities/shooting_enemy.js";
import {LaserEnemy} from "../entities/laser_enemy.js";
import {BaseBooster} from "../entities/base_booster.js";
import {game} from "./game.js";
import {SpinningBoss} from "../entities/spinning_boss.js";

const enemies = [
    {
        name: 'BaseEnemy',
        dropChance: 0.5
    },
    {
        name: 'ShootingEnemy',
        dropChance: 0.3
    },
    {
        name: 'LaserEnemy',
        dropChance: 0.2
    },
];
const bosses = [
    {
        name: 'SpinningBoss',
        dropChance: 1
    },
];
const boosters = [
    {
        name: 'heal',
        dropChance: 0.5
    },
    {
        name: 'shield',
        dropChance: 0.1
    },
    {
        name: 'orbital_shield',
        dropChance: 0.3
    },
    {
        name: 'laser',
        dropChance: 0.1
    },
];

function rnd(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

export default class InfinityModeManager {
    constructor() {
        this.score = 0;
        this.enemiesTotalNum = 5
        this.enemiesKilled = 0
        this.enemiesDestroyed = 0
        this.currentLevelIndex = 0
        this.maxEnemyCount = 5
        this.availableEnemies = []
        this.boostersFrequency = 300
        this.framesTillNextBooster = 300
        this.bossfight = false
    }

    nextLevel() {
        game.state = game.getStateNumber("STATE_BETWEEN_LEVELS")
        this.currentLevelIndex++
        if (this.currentLevelIndex % 5 === 4) {
            this.bossfight = true
        }
        this.enemiesKilled = 0
        this.enemiesDestroyed = 0

        if (this.maxEnemyCount < 60 && !this.bossfight) {
            this.maxEnemyCount += 5
        }
        if (this.boostersFrequency > 100 && !this.bossfight) {
            this.boostersFrequency -= 10
        }
        this.bossfight ? this.enemiesTotalNum = 1 : this.enemiesTotalNum = this.maxEnemyCount
        setTimeout(function () {
            game.state = game.getStateNumber("STATE_RUNNING");
        }, 3000)
    }

    update() {
        while (this.enemiesTotalNum > 0) {
            this.bossfight ? name = SpawnRegulator.selector(bosses).name : name = SpawnRegulator.selector(enemies).name
            switch (name) {
                case 'BaseEnemy':
                    let body = new Body(new Vector(rnd(30, game.playArea.width), 0), 50, 50),
                        enemy = new BaseEnemy(body, "enemy_ship", 10)
                    enemy.movementLogic = enemy.components.add(new ConstantSpeed(new Vector(0, rnd(1, 6))))
                    this.availableEnemies.push(enemy)
                    break
                case 'ShootingEnemy':
                    let body1 = new Body(new Vector(rnd(30, game.playArea.width), rnd(100, 400)), 50, 50)
                    this.availableEnemies.push(
                        new ShootingEnemy(body1, "enemy_ship", 15, 10))
                    break
                case 'LaserEnemy':
                    let body2 = new Body(new Vector(rnd(30, game.playArea.width), rnd(60, 300)), 50, 50)
                    this.availableEnemies.push(
                        new LaserEnemy(body2, "laser_enemy", 15, 10))
                    break
                case 'SpinningBoss':
                    let body4 = new Body(new Vector(game.playArea.width / 2 - 125, 20), 200, 150)
                    let boss1 = new SpinningBoss(body4, "base_boss", 200, 10)

                    this.availableEnemies.push(boss1)

                    break
            }
            this.enemiesTotalNum--
        }
        // Push boosters
        if (this.framesTillNextBooster === 0 && game.state === game.getStateNumber("STATE_RUNNING")) {
            let boostName = SpawnRegulator.selector(boosters).name
            let body = new Body(new Vector(rnd(30, game.playArea.width), 0), 50, 50)
            game.gameObjects.push(new BaseBooster(body, boostName + "_orb", boostName))
            this.framesTillNextBooster = this.boostersFrequency
        }
        this.framesTillNextBooster--

        // Going to the next level
        console.log(this.enemiesKilled)
        if (this.enemiesDestroyed === this.maxEnemyCount || (this.enemiesDestroyed === 1 && this.bossfight)) {
            this.bossfight = false
            if (this.score > 30000) {
                game.gameover()
            } else {
                this.nextLevel()
            }
        }
        // Spawn enemies
        if (rnd(1, 100) > 95 && this.availableEnemies.length > 0 && game.state === game.getStateNumber("STATE_RUNNING")) {
            game.gameObjects.push(this.availableEnemies.shift())
        }
    }
}