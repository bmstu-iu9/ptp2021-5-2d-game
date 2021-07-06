export {loadAssets}

const imageExtensions = ["png", "jpg"],
      soundExtensions = ["mp3", "wav"]

// Assets to be loaded in format: [NAME, FILEPATH]
const ASSETS_LIST = [
    ["player_ship", "img/player.png"],
    ["enemy_ship", "img/enemy_ship.png"],
    ["player_regular_bullet", "img/player_bullet.png"],
    ["player_multi_bullet", "img/player_multi_bullet.png"],
    ["player_shield", "img/shield.png"],
    ["dummy", "img/dummy.png"],
    ["explosion_orange", "effects/explosion_orange.png"],
    ["explosion_purple", "effects/explosion_purple.png"],
    ["enemy_regular_bullet", "img/enemy_bullet.png"],
    ["enemy_haunting_bullet", "img/enemy_rocket.png"],
    ["player_hp_bar", "img/player_hp_bar.png"],
    ["player_hp_bar_back", "img/player_hp_bar_back.png"]
]

/**Loads all game assets.
 * When every asset is loaded, executes callback()
 */
function loadAssets(callback) {
    let aName, aSrc, result = {}, count = ASSETS_LIST.length, onSingleAssetLoad = function () {
        if (--count === 0) {
            console.log(ASSETS_LIST.length + " assets loaded!")
            callback(result);
        }
    };
    console.log("Loading assets...")

    for (let i = 0; i < ASSETS_LIST.length; i++) {
        [aName, aSrc] = ASSETS_LIST[i]
        if (isImage(aSrc)) {
            result[aName] = new Image();
        } else if (isSound(aSrc)) {
            result[aName] = new Audio()
        }
        result[aName].onload = onSingleAssetLoad;
        result[aName].src = "./assets/" + aSrc;
    }

    return result
}

/**Determine if given filename holds an image.
 *
 * @param fName filename to check
 * @returns {boolean} result of check
 */
function isImage(fName) {
    return imageExtensions.includes(fName.split('.').pop())
}

/**Determine if given filename holds a sound.
 *
 * @param fName filename to check
 * @returns {boolean} result of check
 */
function isSound(fName) {
    return soundExtensions.includes(fName.split('.').pop())
}