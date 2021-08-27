import Component from "../core/component.js";
import AssetsManager from "../core/assets_manager.js";

export {FlameRender}

class FlameRender extends Component {
    constructor(owner, animationAtlasName, sx, sy, frameHeight, frameWidth, num, step) {
        super("FlameRender", owner);
        this.atlas = AssetsManager.textures[animationAtlasName]
        this.owner = owner
        this.sx = sx
        this.sy = sy
        this.frameHeight = frameHeight
        this.frameWidth = frameWidth
        this.num = num
        this.step = step
        this.i = 0
    }
    preRender(ctx) {
        super.preRender(ctx)
        let body = this.owner.body
        let x = body.centerX
        let y = body.centerY
        ctx.save()

        ctx.translate(x, y)
        ctx.rotate(-90*Math.PI/180)

        let sizeY = this.frameHeight/3
        let sizeX = this.frameWidth/3
        ctx.drawImage(this.atlas.image, this.sx + this.i*this.step, this.sy, this.frameWidth, this.frameHeight,
            -sizeX, -sizeY/2, sizeX, sizeY);

        ctx.restore();

        this.i = (this.i+1)%this.num;
    }
}
