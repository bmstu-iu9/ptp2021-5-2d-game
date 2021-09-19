import Component from "../core/component.js";
import AssetsManager from "../core/assets_manager.js";
import {PLAYER} from "../core/game_constants.js";

export {FlameRender}

/**
 * This Component renders engine's trust according to its owner's speed.
 */
class FlameRender extends Component {
    /**
     *
     * @param atlasName {String} name of atlas loaded into AssetsManager
     * @param flameHeight {Number} the maximum height of the flame animation
     * @param flameWidth {Number} the maximum width of the flame animation
     * @param maxSpeed {Number} maximum speed that this Component's owner can reach. Will be used to animate trust's
     * width and height.
     */
    constructor(atlasName, flameHeight = 70, flameWidth = 60, maxSpeed = PLAYER.MAX_SPEED) {
        super("FlameRender")

        this.atlas = AssetsManager.textures[atlasName]
        this.cellIndex = 0
        this.flameHeight = flameHeight
        this.flameWidth = flameWidth

        this.maxSpeed = maxSpeed
    }

    update() {
        super.update()
    }

    preRender(ctx) {
        super.preRender(ctx)

        let sizeFactor = Math.min(1, Math.max(0.6, this.owner.movementLogic.speed.length / this.maxSpeed)),
            height = this.flameHeight * sizeFactor,
            width = this.flameWidth * sizeFactor,
            posX = this.owner.body.centerX - width / 2,
            posY = this.owner.body.centerY + this.owner.body.height / 2 - height / 1.5

        let cell = this.atlas.cells[this.cellIndex]
        ctx.drawImage(this.atlas.image, cell.x, cell.y, cell.w, cell.h, posX, posY,
            width, height)

        this.cellIndex = (this.cellIndex + 1) % this.atlas.cells.length;
    }
}
