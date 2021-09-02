import AssetsManager from "./assets_manager.js";
import StaticClass from "../util/static_class.js";

export default class SoundManager extends StaticClass {
    /**
     * runAgain() - runs sound from the beginning
     * @param soundName - name of the sound
     * @param volume - A number between 0 and 1. Adjusts the sound volume
     *
     */
    static runAgain(soundName, volume) {
        let sound = new Audio(AssetsManager.sounds[soundName].src)
        sound.currentTime = 0
        sound.volume = volume
        AssetsManager.sounds[soundName].play()
    }

    /**
     * playSoundAsync(soundName, volume) - parameters are similar to  runAgain(soundName, volume)
     * This method is used to play copies of one sound asynchronously
     * @param soundName
     * @param volume
     */
    static playSoundAsync(soundName, volume) {
        let sound = new Audio(AssetsManager.sounds[soundName].src)
        sound.volume = volume
        sound.play()
    }

    /**
     * turns off the sound and sets its playing time to 0
     * @param soundName
      */
    static offSound(soundName) {
        AssetsManager.sounds[soundName].pause()
        AssetsManager.sounds[soundName].currentTime = 0
    }

    //playerSounds - sounds emitted inside player.js
    static playerSounds(soundName) {
        switch (soundName) {
            case "player_shot":
                this.offSound("laser")
                this.runAgain(soundName)
                break
            case "multi_shot":
                this.offSound("laser")
                this.runAgain(soundName)
                break
            case "laser":
                AssetsManager.sounds["laser"].addEventListener('timeupdate', function () {
                    let buffer = 0.1
                    if (this.currentTime > this.duration - buffer) {
                        this.currentTime = 0
                        this.play()
                    }
                });
                AssetsManager.sounds["laser"].play()
                break
            case "heal":
                this.runAgain(soundName)
                break
            case "shield":
                this.runAgain(soundName)
                break
        }
    }

    //gameSounds - sounds processed by the game
    //for example, destroying enemies by the player
    //collisions with boosters activate player.js methods so their sounds are relative to playerSounds
    static gameSounds(soundName) {
        switch (soundName) {
            case "explosion":
                this.runAgain('explosion')
                break
        }
    }

    //These are the sounds played inside enemy classes.
    static enemySounds(soundName) {
        switch (soundName) {
            case "shooting_enemy_shot":
                this.playSoundAsync(soundName)
                break
            case "spinning_boss_shot":
                this.playSoundAsync(soundName)
                break
        }
    }
}