import SpriteSheet from "../textures/sprite_sheet.js";
import SingleImage from "../textures/single_image.js";

export {AssetManager}

const imageExtensions = ["png", "jpg"],
    soundExtensions = ["mp3", "wav"]

const ASSET_TYPE = Object.freeze({
    IMAGE: 0,
    SOUND: 1,
})

/**
 * For SingleImage use: [FILENAME]
 * For SpriteSheet use: [FILENAME, CELL_WIDTH, CELL_HEIGHT]
 * @type {string[][]}
 */
const ASSETS_LIST = [
    ["img/player_ship.png"],
    ["img/enemy_ship.png"],
    ["img/player_regular_bullet.png"],
    ["img/player_multi_bullet.png"],
    ["img/player_shield.png"],
    ["img/dummy.png"],
    ["effects/explosion_orange.png", 100, 100],
    ["effects/explosion_purple.png", 100, 100],
    ["effects/heal_animation.png", 192, 192],
    ["img/enemy_regular_bullet.png"],
    ["img/enemy_rocket.png"],
    ["img/player_hp_bar.png"],
    ["img/player_hp_bar_back.png"],
    ["img/heal_orb.png"],
    ["img/player_laser.png"],
    ["img/orbital_shield.png"],
    ["img/orbital_shield_orb.png"],
    ["img/laser_orb.png"],
    ["sounds/player_shot.mp3"],
    ["sounds/laser3.mp3"],
    ["sounds/multiple.mp3"],
    ["sounds/base_enemy_destruction.mp3"],
    ["sounds/boost.mp3"],
]

export default class AssetManager {
    constructor(game, assetsLoadedCallback) {
        this._game = game
        this._callback = assetsLoadedCallback

        this.textures = {}
        this.sounds = {}

        this._loadAssets(assetsLoadedCallback)
    }

    addFromFile(assetInfo, callback) {
        let assetSrc = "./assets/" + assetInfo[0],
            assetName = extractFilename(assetSrc)

        switch (determineAssetType(assetSrc)) {
            case ASSET_TYPE.IMAGE:
                let img = new Image()
                img.src = assetSrc

                if (assetInfo.length === 3) {
                    img.onload = function () {
                        this.textures[assetName] = new SpriteSheet(assetName, img, assetInfo[1], assetInfo[2])
                        callback()
                    }
                } else {
                    img.onload = function () {
                        this.textures[assetName] = new SingleImage(assetName, img)
                        callback()
                    }
                }

                img.onload = img.onload.bind(this)
                break

            case ASSET_TYPE.SOUND:
                this.sounds[assetName] = new Audio(assetSrc)
                this.sounds[assetName].volume = 0.2
                callback()

                break
        }
    }

    _loadAssets(assetsLoadedCallback) {
        let assetsUnhandledCount = ASSETS_LIST.length,
            onSingleAssetLoaded = function () {
                if (--assetsUnhandledCount === 0) {
                    console.log(ASSETS_LIST.length + " assets loaded!")
                    assetsLoadedCallback();
                }
            };
        console.log("Loading assets...")

        for (let i = 0; i < ASSETS_LIST.length; i++) {
            this.addFromFile(ASSETS_LIST[i], onSingleAssetLoaded)
        }
    }
}

/**Determine asset type for passed filename.
 *
 * @param fName filename to check
 * @returns {ASSET_TYPE} check result
 */
function determineAssetType(fName) {
    let fileExt = fName.split('.').pop()
    if (imageExtensions.includes(fileExt))
        return ASSET_TYPE.IMAGE
    else if (soundExtensions.includes(fileExt))
        return ASSET_TYPE.SOUND
    else
        throw "Unknown file extension: " + fileExt
}

/** Returns filename without extension.
 *
 * @param fPath{string}
 * @returns {string}
 */
function extractFilename(fPath) {
    return fPath.split('\\').pop().split('/').pop().split('.')[0]
}