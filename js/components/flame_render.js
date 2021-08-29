import Component from "../core/component.js";
import AssetsManager from "../core/assets_manager.js";

export {FlameRender}

class FlameRender extends Component {
    constructor(owner, animationAtlasName, flameHeight=120, flameWidth=70) {
        super("FlameRender", owner);
        this.atlas = AssetsManager.textures[animationAtlasName]
        this.body = owner.body
        this.cellIndex = 0
        this.flameHeight = flameHeight
        this.flameWidth = flameWidth
    }
    preRender(ctx) {
        super.preRender(ctx)
        ctx.save()
        ctx.translate(this.body.centerX, this.body.centerY)
        ctx.rotate(-90*Math.PI/180)
        let cell = this.atlas.cells[this.cellIndex]
        ctx.drawImage(this.atlas.image, cell.x, cell.y, cell.w, cell.h,  -this.flameHeight+this.body.width/2, -this.flameWidth/2,
            this.flameHeight, this.flameWidth)
        ctx.restore();
        this.cellIndex = (this.cellIndex + 1)%this.atlas.cells.length;
    }
}
