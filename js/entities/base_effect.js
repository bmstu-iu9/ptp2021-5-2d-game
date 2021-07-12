import {BaseEntity} from "./base_entity.js";

export default class BaseEffect extends BaseEntity {
    constructor(body, atlas, repeatOnce = true, ignoreRotation = true) {
        super(body, atlas)

        if (ignoreRotation)
            this.body.rotation = 0

        if (repeatOnce) {
            this.animationManager.currentAnimation.loop = false
            this.animationManager.currentAnimation.onComplete.addListener(function () {
                this.destroy()
            }, this)
        }
    }
}
