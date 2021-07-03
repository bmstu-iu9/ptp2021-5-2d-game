export {loadAssets}

const imageExtensions = ["png", "jpg"]
const soundExtensions = ["mp3", "wav"]

let assets = [
    ["playerSprite", "img/player.png"],
    ["baseEnemy", "img/base_enemy.png"],
    ["playerBullet", "img/player_bullet.png"],
    ["playerShield", "img/shield.png"],
    ["dummy", "img/dummy.png"],
    ["explosionOrange", "effects/explosion_orange.png"],
    ["enemyBullet", "img/enemy_bullet.png"],
    ["enemyRocket", "img/enemy_rocket.png"]
]

/** Loads all game assets.
 * When every asset is loaded, executes collisionCallback() */
function loadAssets(callback) {
    let aName, aSrc,
        result = {},
        count = assets.length,
        onSingleAssetLoad = function () {
            console.log(count - 1)
            if (--count === 0) {
                console.log(assets.length + " assets loaded!")
                callback(result);
            }
        };
    console.log("Loading assets...")

    for (let i = 0; i < assets.length; i++) {
        [aName, aSrc] = assets[i]
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

function isImage(fName) {
    return imageExtensions.includes(fName.split('.').pop())
}

function isSound(fName) {
    return soundExtensions.includes(fName.split('.').pop())
}