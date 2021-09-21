import SpawnRegulator from "./spawn_regulator.js";
import {BaseEnemy} from "../../entities/base_enemy.js";
import Body from "../../physics/body.js";
import Vector from "../../math/vector.js";
import {ConstantSpeed} from "../../components/movement_logic.js";
import Chance from "../../util/chance.js";
import Shared from "../../util/shared.js";
import {HunterEnemy, LaserEnemy} from "../../entities/armed_enemies.js";

/**
 * This module spawns enemies/boss in a normal way.
 */
export default class RegularSpawner {
    constructor(manager) {
        this.manager = manager

        this.isActive = false
    }

    /**
     * Activate this spawner. Crazy spawner should be deactivated first.
     */
    activate() {
        this.isActive = true
    }

    /**
     * Select random enemy and push it into the game.
     * @private
     */
    _spawn() {
        let name = SpawnRegulator.selector(enemies).name
        switch (name) {
            case 'BaseEnemy':
                let enemy = new BaseEnemy(new Body(new Vector(), 50, 50), "base_enemy", 10)
                enemy.movementLogic = enemy.components.add(
                    new ConstantSpeed(new Vector(0, Chance.randomRange(1.5, 6))))
                this.manager.spawn(enemy)
                break
            case 'HunterEnemy':
                let pos = new Vector(Chance.randomRange(100, Shared.gameWidth - 100), Chance.randomRange(100, 400))
                this.manager.spawn(new HunterEnemy(new Body(pos, 50, 50)))
                break
            case 'LaserEnemy':
                let pos1 = new Vector(Chance.randomRange(100, Shared.gameWidth - 100), Chance.randomRange(60, 300))
                this.manager.spawn(new LaserEnemy(new Body(pos1, 50, 50)))
                break
        }
    }

    update() {
        if (!this.isActive)
            return

        if (Chance.oneIn(20) && this.manager.enemiesSpawned !== this.manager.maxEnemiesCount)
            this._spawn()
    }
}

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
    }
]
