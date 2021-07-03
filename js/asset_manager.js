export {loadAssets}

let assets = [
    ["playerSprite", "img/player.png"],
    ["baseEnemy", "img/base_enemy.png"],
    ["playerBullet", "img/player_bullet.png"],
    ["playerShield", "img/shield.png"],
    ["dummy", "img/dummy.png"],
    ["explosionOrange", "effects/explosion_orange.png"],
]

/** Loads all game assets.
 * When every asset is loaded, executes callback() */
function loadAssets(callback) {
    let aName, aSrc,
        result = {},
        count = assets.length,
        onSingleAssetLoad = function () {
            console.log(count - 1)
            if (--count === 0) {
                console.log(count + " assets loaded!")
                callback(result);
            }
        };
    console.log("Loading assets...")

    for (let i = 0; i < assets.length; i++) {
        [aName, aSrc] = assets[i]
        result[aName] = new Image();
        result[aName].onload = onSingleAssetLoad;
        result[aName].src = "./assets/" + aSrc;
    }

    return result
}