export default class ComponentManager {
    constructor(owner) {
        this.owner = owner

        this._components = {}
    }

    /**
     * Tell if this ComponentManager has component with the given name.
     *
     * @param name Component's name
     * @return {boolean} if this ComponentManager has component with the given name.
     */
    hasComponent(name) {
        return this._components.hasOwnProperty(name)
    }

    /**
     * Get the Component that has specified name.
     *
     * @param name Component's name
     * @return {null|*} Component which has the specified name or null
     */
    getComponent(name) {
        if (this._components[name])
            return this._components[name]

        return null
    }

    /**
     * Add given Component to this ComponentManager.
     *
     * @param component Component to be added
     * @return {*} the given Component
     */
    add(component) {
        if (component.owner === null)
            component.owner = this.owner

        this._components[component.name] = component

        return component
    }

    /**
     * Remove given Component from this ComponentManager.
     *
     * @param component Component to be removed
     */
    removeComponent(component) {
        for (let i = 0; i < this._components.length; i++) {
            if (this._components[i] === component) {
                delete this._components[i]
                return
            }
        }
    }

    /**
     * Replace Component with specified name with other Component.
     * The replaced component will be put back when the <DURATION> milliseconds or
     * when the given component is destroyed.
     *
     * @param name {String} the name of the Component which will be disabled
     * @param other {Component} the Component to replace to replace current with
     * @param duration {Number} the period of time after which the replaced component will be put back (in
     * milliseconds). If set to 0, then the replaced component will be put back only when the new component is
     * destroyed.
     */
    replaceComponent(name, other, duration = 0) {
        if (this._components[name] === undefined)
            return

        this._components[name].isActive = false
        this.add(other)

        let reversalFn = function () {
            this.getComponent(name).isActive = true
            this.removeComponentByName(other.name)
        }.bind(this)

        if (duration)
            setTimeout(reversalFn, duration)
        else
            other.onDestroy.addListener(reversalFn)
    }

    removeComponentByName(name) {
        if (this._components[name])
            delete this._components[name]
    }

    preUpdate() {
        for (let component of Object.values(this._components)) {
            if (component.isActive)
                component.preUpdate()
        }
    }

    update() {
        for (let component of Object.values(this._components)) {
            if (component.isActive)
                component.update()
        }
    }

    postUpdate() {
        for (let component of Object.values(this._components)) {
            if (component.isActive)
                component.postUpdate()
        }
    }

    preRender(ctx) {
        for (let component of Object.values(this._components)) {
            if (component.isActive)
                component.preRender(ctx)
        }
    }

    postRender(ctx) {
        for (let component of Object.values(this._components)) {
            if (component.isActive)
                component.postRender(ctx)
        }
    }
}