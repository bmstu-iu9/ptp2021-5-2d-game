import Shared from "../../util/shared.js";
import {ENTITY_STATE, WEAPON_TYPE} from "../enums.js";
import {BALANCE, PLAYER} from "../game_constants.js";
import {BaseBooster, HealBooster, MultiBooster, ShieldBooster} from "../../entities/base_booster.js";
import Chance from "../../util/chance.js";
import SpawnRegulator from "./spawn_regulator.js";
import Body from "../../physics/body.js";
import Vector from "../../math/vector.js";

/**
 * This module tracks when player is vulnerable and provides support.
 */
export default class PlayerSatisfactionModule {
    constructor(manager) {
        this.manager = manager

        this.additionalHealCooldown = 0
        this.additionalShieldCooldown = 0
        this.additionalMultiCooldown = 0
        this.supportCooldown = 0

        this.lastChanceUsed = false
        Shared.player.destroy = this.onPlayerDestroyed.bind(this)
    }

    /**
     * This method replaces Player.destroy(). When player is about to die, this method provides him a last chance by
     * giving a shield and restoring health to full.
     */
    onPlayerDestroyed() {
        if (this.lastChanceUsed) {
            Shared.player.state = ENTITY_STATE.DESTROYED
            this.manager.game.gameover()
            return
        }

        this.lastChanceUsed = true

        Shared.player.applyShield()
        Shared.player.shield.body.scale(1.5)
        let counter = 0, id = setInterval(function () {
            Shared.player.heal(10)

            if (++counter > 10)
                clearInterval(id)
        }, 200)
    }

    spawn_boosters() {
        let shouldSpawn = Chance.oneIn(BALANCE.BOOSTERS_FREQUENCY)
        if (!shouldSpawn)
            return

        let boostName = SpawnRegulator.selector(boosters).name,
            body = new Body(new Vector(), 50, 50)
        this.manager.spawn(new BaseBooster(body, boostName + "_orb", boostName))
    }

    update() {
        const player = Shared.player

        let healthLevel = player.health / PLAYER.MAX_HEALTH,
            shieldLevel = player.shield ? player.shield.lifetime.remaining / PLAYER.POWERUPS.DURATION : 0,
            tooManyEnemies = (!this.manager.crazySpawner.isActive && this.manager.enemiesActive >= 13) ||
                (this.manager.crazySpawner.isActive && this.manager.enemiesActive >= 33)

        // Player has low health -> give health booster
        if (healthLevel < 0.4 && this.additionalHealCooldown < 0) {
            this.manager.spawn(new HealBooster(true))
            this.additionalHealCooldown = BALANCE.ADDITIONAl_HEALTH_COOLDOWN
            this.supportCooldown = BALANCE.SUPPORT_COOLDOWN
        }

        // Many enemies -> give weapon to eliminate them
        if ((this.manager.enemiesActive < 10 || this.additionalMultiCooldown < -BALANCE.ADDITIONAL_MULTI_COOLDOWN) &&
            player.currentWeaponType !== WEAPON_TYPE.MULTI &&
            player.currentWeaponType !== WEAPON_TYPE.LASER &&
            this.additionalMultiCooldown < 0
        ) {
            this.manager.spawn(new MultiBooster(true))
            this.additionalMultiCooldown = BALANCE.ADDITIONAL_MULTI_COOLDOWN
            this.supportCooldown = BALANCE.SUPPORT_COOLDOWN
        }

        // There's a slaughter -> silently extend player's shield duration
        // Else if its still hot -> give shield booster
        if (shieldLevel < 0.25 && tooManyEnemies && this.additionalShieldCooldown < 0) {
            this.manager.spawn(new ShieldBooster(true))
            this.additionalShieldCooldown = BALANCE.ADDITIONAL_SHIELD_COOLDOWN
            this.manager.supportCooldown = BALANCE.SUPPORT_COOLDOWN
        } else if (healthLevel < 0.5 && player.shield && shieldLevel < 0.2 && tooManyEnemies) {
            player.applyShield()
            this.manager.additionalShieldCooldown = BALANCE.ADDITIONAL_SHIELD_COOLDOWN
            this.manager.supportCooldown = BALANCE.SUPPORT_COOLDOWN
        }

        this.additionalHealCooldown--
        this.additionalShieldCooldown--
        this.additionalMultiCooldown--
        this.supportCooldown--

        this.spawn_boosters()
    }
}

const boosters = [
    {
        name: 'heal',
        dropChance: 0.6
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
        dropChance: 0.2
    },
]
