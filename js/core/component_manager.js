export default class ComponentManager {
    constructor(owner) {
        this.owner = owner

        this._components = {}
    }

    hasComponent(name) {
        return this._components.hasOwnProperty(name)
    }

    getComponent(name) {
        if (this._components[name])
            return this._components[name]

        return null
    }

    add(component) {
        component.owner = this.owner
        this._components[component.name] = component

        return component
    }

    removeComponent(component) {
        for (let i = 0; i < this._components.length; i++) {
            if (this._components[i] === component) {
                delete this._components[i]
            }
        }
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
}