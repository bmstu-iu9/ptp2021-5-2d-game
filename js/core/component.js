/**Base class for all components.
 *
 */
export default class Component {
    constructor(name) {
        this.name = name

        // Will be set by ComponentManager
        this.owner = null

        this.isActive = true
    }

    preUpdate() {}

    update() {}

    postUpdate() {}
}