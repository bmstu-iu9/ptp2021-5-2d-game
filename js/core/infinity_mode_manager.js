import SpawnRegulator from "./spawn_regulator.js";
import Body from "../physics/body.js";
import Vector from "../math/vector.js";
import {BaseEnemy} from "../entities/base_enemy.js";
import {ConstantSpeed} from "../components/movement_logic.js";
import {HunterEnemy, LaserEnemy} from "../entities/armed_enemies.js";
import {BaseBooster} from "../entities/base_booster.js";
import {game} from "./game.js";

const enemies = [
    {
        name: 'BaseEnemy',
        dropChance: 0.7
    },
    {
        name: 'HunterEnemy',
        dropChance: 0.4
    },
    {
        name: 'LaserEnemy',
        dropChance: 0.1
    },
];
const boosters = [
    {
        name: 'heal',
        dropChance: 0.7
    },
    {
        name: 'shield',
        dropChance: 0.2
    },
    {
        name: 'orbital_shield',
        dropChance: 0.2
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
        this.enemiesTotalNum = 10
        this.enemiesKilled = 0
        this.currentLevelIndex = 0
        this.maxEnemyCount = 10
        this.availableEnemies = []
        this.boostersFrequency = 300
        this.framesTillNextBooster = 0
    }

    nextLevel() {
        game.state = game.getStateNumber("STATE_BETWEEN_LEVELS")
        this.currentLevelIndex++
        this.enemiesKilled = 0
        if (this.maxEnemyCount < 30) {
            this.maxEnemyCount += 5
        }
        this.enemiesTotalNum = this.maxEnemyCount
        setTimeout(function () {
            game.state = game.getStateNumber("STATE_RUNNING");
        }, 3000)
    }

    update() {
        while (this.enemiesTotalNum > 0) {
            name = SpawnRegulator.selector(enemies).name
            switch (name) {
                case 'BaseEnemy':
                    let body = new Body(new Vector(rnd(30, game.playArea.width), 0), 50, 50),
                        enemy = new BaseEnemy(body, "base_enemy", 10)
                    enemy.movementLogic = enemy.components.add(new ConstantSpeed(new Vector(0, rnd(1, 6))))
                    this.availableEnemies.push(enemy)
                    break
                case 'HunterEnemy':
                    let body1 = new Body(new Vector(rnd(30, game.playArea.width), rnd(100, 400)), 50, 50)
                    this.availableEnemies.push(new HunterEnemy(body1))
                    break
                case 'LaserEnemy':
                    let body2 = new Body(new Vector(rnd(30, game.playArea.width), rnd(60, 300)), 50, 50)
                    this.availableEnemies.push(new LaserEnemy(body2))
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
        if (this.enemiesKilled === this.maxEnemyCount) {
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
