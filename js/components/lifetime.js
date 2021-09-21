import Component from "../core/component.js";
import {DESTRUCTION_REASONS} from "../core/enums.js";

export default class Lifetime extends Component {
    constructor(lifetime) {
        super("Lifetime")
        this.remaining = lifetime
    }

    update() {
        if (--this.remaining <= 0)
            this.owner.destroy(DESTRUCTION_REASONS.LIFETIME_ENDED)
    }
}