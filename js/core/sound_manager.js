import AssetsManager from "./assets_manager.js";
import StaticClass from "../util/static_class.js";

export default class SoundManager extends StaticClass {
    static runAgain(soundName) {
        AssetsManager.sounds[soundName].currentTime = 0
        AssetsManager.sounds[soundName].play()
    }
    static playSoundAsync(src){
        let sound = new Audio(src)
        sound.volume = 0.1
        sound.play()
    }
    static offSound(soundName){
        AssetsManager.sounds[soundName].pause()
        AssetsManager.sounds[soundName].currentTime = 0
    }
    static playerSounds(soundName) {
        switch (soundName) {
            case "player_shot":
                this.offSound("laser")
                this.runAgain(soundName)
                break
            case "multi_shot":
                this.offSound("laser")
                for (let i = 0; i < 6; i++){
                    this.playSoundAsync(AssetsManager.sounds["player_shot"].src)
                }
                break
            case "laser":
                AssetsManager.sounds["laser"].addEventListener('timeupdate', function(){
                    let buffer = 0.1
                    if(this.currentTime > this.duration - buffer){
                        this.currentTime = 0
                        this.play()
                    }
                });
                AssetsManager.sounds["laser"].play()
        }
    }
}