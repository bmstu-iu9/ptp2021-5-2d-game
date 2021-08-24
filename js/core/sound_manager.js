import AssetsManager from "./assets_manager.js";
import StaticClass from "../util/static_class.js";

export default class SoundManager extends StaticClass {
    static runAgain(soundName) {
        AssetsManager.sounds[soundName].currentTime = 0
        AssetsManager.sounds[soundName].play()
    }
    static playerSounds(soundName) {
        switch (soundName) {
            case "player_shot":
                this.runAgain(soundName)
                break
        }
    }
}