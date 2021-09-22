import Component from "../core/component.js";
import {DESTRUCTION_REASONS} from "../core/enums.js";

/**
 * This Component limits its owner's lifetime.
 */
export default class Lifetime extends Component {
    /**
     *
     * @param lifetime {Number} the number of frames after which this Component's owner will be destroyed.
     */
    constructor(lifetime) {
        super("Lifetime")
        this.remaining = lifetime
    }

    update() {
        if (--this.remaining <= 0)
            this.owner.destroy(DESTRUCTION_REASONS.LIFETIME_ENDED)
    }
}
