import {BALANCE} from "../game_constants.js";
import Chance from "../../util/chance.js";
import Body from "../../physics/body.js";
import Vector from "../../math/vector.js";
import Shared from "../../util/shared.js";
import {BaseEnemy} from "../../entities/base_enemy.js";
import {ConstantSpeed} from "../../components/movement_logic.js";

const CRAZY_MODE_VERTICAL = 0,
    CRAZY_MODE_HORIZONTAL = 1
/**
 * This module spawns enemy in crazy waves.
 */
export default class CrazySpawner {
    constructor(manager) {
        this.manager = manager

        this.isActive = false
    }

    /**
     * Activate this spawner. Regular spawner should be deactivated first.
     */
    activate() {
        this.isActive = true
        this.enemiesSpawned = 0
        this.cooldown = BALANCE.CRAZYSPAWNER_COOLDOWN

        this.manager.maxEnemiesCount += BALANCE.CRAZYSPAWNER_CAPACITY

        this.mode = Chance.randomRange(0, 2)
    }

    update() {
        if (!this.isActive || --this.cooldown > 0)
            return
        this.cooldown = BALANCE.CRAZYSPAWNER_COOLDOWN

        switch (this.mode) {
            case CRAZY_MODE_VERTICAL:
                let leftBody = new Body(new Vector(Shared.gameWidth / 2 - 100, -50), 50, 50),
                    rightBody = new Body(new Vector(Shared.gameWidth / 2 + 50, -50), 50, 50),
                    left = new BaseEnemy(leftBody, 'base_enemy', 5),
                    right = new BaseEnemy(rightBody, 'base_enemy', 5);
                left.movementLogic = left.components.add(new ConstantSpeed(new Vector(0, 7)))
                right.movementLogic = right.components.add(new ConstantSpeed(new Vector(0, 7)))
                this.manager.spawn(left, right)

                break
            case CRAZY_MODE_HORIZONTAL:
                let upperBody = new Body(new Vector(-50, 150), 50, 50, true, Math.PI / 2),
                    lowerBody = new Body(new Vector(Shared.gameWidth, 250), 50, 50, true, -Math.PI / 2),
                    upper = new BaseEnemy(upperBody, 'base_enemy', 5),
                    lower = new BaseEnemy(lowerBody, 'base_enemy', 5)
                upper.movementLogic = upper.components.add(new ConstantSpeed(new Vector(7, 0)))
                lower.movementLogic = lower.components.add(new ConstantSpeed(new Vector(-7, 0)))
                this.manager.spawn(upper, lower)

                break

        }

        this.enemiesSpawned += 2
        if (this.enemiesSpawned >= BALANCE.CRAZYSPAWNER_CAPACITY) {
            this.isActive = false
            this.manager.regularSpawner.activate()
        }
    }
}
