import {game} from "../core/game.js";
import {WEAPON_TYPE} from "./enums.js";
import {BaseEnemy} from "../entities/base_enemy.js";
import {BaseBooster} from "../entities/base_booster.js";

function replay(sound_key){
    if (game.assets.sounds[sound_key].currentTime !== 0.0){
        game.assets.sounds[sound_key].pause()
        game.assets.sounds[sound_key].currentTime = 0.0
    }
    game.assets.sounds[sound_key].play()
}

function playPlayerWeaponSound(context){
    switch (context) {
        case WEAPON_TYPE.REGULAR:
            replay('player_shot')
            break

        case WEAPON_TYPE.LASER:
            game.assets.sounds['laser3'].play()
            break

        case WEAPON_TYPE.MULTI:
            replay('multiple')
            break

    }
}
function playDestructionSound(context) {
    if (context instanceof BaseEnemy){
        replay('base_enemy_destruction')
    }else if (context instanceof BaseBooster){
        replay('boost')
    }
}
export default class SoundManager {
    constructor() {
        game.player.onFire.addListener(playPlayerWeaponSound)
        game.destroyed.addListener(playDestructionSound)
    }
}