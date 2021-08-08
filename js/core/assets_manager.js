import SpriteSheet from "../textures/sprite_sheet.js";
import SingleImage from "../textures/single_image.js";
import StaticClass from "../util/static_class.js";

const imageExtensions = ["png", "jpg"],
    soundExtensions = ["mp3", "wav"]

const ASSET_TYPE = Object.freeze({
    IMAGE: 0,
    SOUND: 1,
})

/**
 * <p>For SingleImage use: [FILENAME]
 * <p>For SpriteSheet use: [FILENAME, CELL_WIDTH, CELL_HEIGHT]
 *
 * <p>Every asset loaded will be available under its filename. Example: "img/player_ship.png" will be available as
 * AssetsManager.textures["player_ship"]
 *
 * @type {string[][]}
 */
const ASSETS_LIST = [
    ["effects/explosion_boss.png", 192, 192],
    ["effects/explosion_orange.png", 100, 100],
    ["effects/explosion_purple.png", 100, 100],
    ["effects/heal_animation.png", 192, 192],
    ["effects/lightning_animation.png", 128, 512],
    ["effects/shield_animation.png", 192, 192],
    ["effects/thrust_animation.png", 192, 192],
    ["img/base_boss.png"],
    ["img/boss_hp_bar.png"],
    ["img/boss_hp_bar_back.png"],
    ["img/dummy.png"],
    ["img/enemy_regular_bullet.png"],
    ["img/enemy_rocket.png"],
    ["img/enemy_ship.png"],
    ["img/heal_orb.png"],
    ["img/laser_bullet.png"],
    ["img/laser_enemy.png"],
    ["img/laser_orb.png"],
    ["img/orbital_shield.png"],
    ["img/shield_orb.png"],
    ["img/player_hp_bar.png"],
    ["img/player_hp_bar_back.png"],
    ["img/player_laser.png"],
    ["img/player_multi_bullet.png"],
    ["img/player_regular_bullet.png"],
    ["img/player_shield.png"],
    ["img/player_ship.png"],
]

/**
 * <p>Loads all game assets into memory.
 * <pre>
 *     images will be available under AssetsManager.textures
 *     sounds will be available under AssetsManager.sounds
 * </pre>
 * <p>Path to an asset should be hardcoded into ASSETS_LIST. Every asset loaded will be available under its filename.
 * <br>Example: "img/player_ship.png" will be available as: <br>AssetsManager.textures["player_ship"]
 */
export default class AssetsManager extends StaticClass {
    static textures = {}
    static sounds = {}

    static addFromFile(assetInfo, callback) {
        let assetSrc = "./assets/" + assetInfo[0],
            assetName = extractFilename(assetSrc)

        switch (determineAssetType(assetSrc)) {
            case ASSET_TYPE.IMAGE:
                let img = new Image()
                img.src = assetSrc

                if (assetInfo.length === 3) {
                    img.onload = function () {
                        AssetsManager.textures[assetName] = new SpriteSheet(assetName, img, assetInfo[1], assetInfo[2])
                        callback()
                    }
                } else {
                    img.onload = function () {
                        AssetsManager.textures[assetName] = new SingleImage(assetName, img)
                        callback()
                    }
                }

                break

            case ASSET_TYPE.SOUND:
                throw "Sounds are not supported yet. Implement if you wish :)"
        }
    }

    static loadAssets(assetsLoadedCallback) {
        let assetsUnhandledCount = ASSETS_LIST.length,
            onSingleAssetLoaded = function () {
                if (--assetsUnhandledCount === 0) {
                    console.log(ASSETS_LIST.length + " assets loaded!")
                    assetsLoadedCallback();
                }
            };
        console.log("Loading assets...")

        for (let i = 0; i < ASSETS_LIST.length; i++) {
            AssetsManager.addFromFile(ASSETS_LIST[i], onSingleAssetLoaded)
        }
    }
}

/**
 * Determine asset type for passed filename.
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

/**
 * Extract filename without extension.
 *
 * @param fPath{string}
 * @returns {string}
 */
function extractFilename(fPath) {
    return fPath.split('\\').pop().split('/').pop().split('.')[0]
}
