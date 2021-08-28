import Component from "../core/component.js";

const DURATION_FOREVER = -1

export {MultiWeaponLogic}

class ShootingLogic extends Component {
    constructor(name, fireRate) {
        super(name)
        this.stateCounter = 0
        this.fireRate = fireRate
    }

    update() {
        if (++this.stateCounter === this.fireRate) {
            this.stateCounter = 0
            this.fire()
        }
    }

    fire() {
    }
}

/**
 *
 */
class MultiWeaponLogic extends ShootingLogic {
    constructor(fireRate, {states, defaultType, firstType}) {
        super("MultiWeapon", fireRate)
        this.states = states
        this.defaultType = null

        if (defaultType === undefined && firstType === undefined)
            throw "You must specify either first or default weapon type"

        this.currentType = firstType || defaultType
        this.currentDurationRemaining = this.states[firstType].duration || DURATION_FOREVER

        if (defaultType !== undefined)
            this.defaultType = defaultType
    }

    changeWeapon(weaponType) {
        console.log("Changed weapon to:" + weaponType)
        if (!(weaponType in this.states))
            throw "No such weapon type: " + weaponType

        this.currentType = weaponType

        if (this.states[this.currentType].installedFn !== undefined)
            this.states[this.currentType].installedFn()

        if (this.defaultType !== null && this.currentType === this.defaultType)
            this.currentDurationRemaining = DURATION_FOREVER
        else
            this.currentDurationRemaining = this.states[this.currentType].duration
    }

    preUpdate() {
        if (this.currentDurationRemaining === DURATION_FOREVER)
            return

        if (--this.currentDurationRemaining === 0) {
            let nextType = this.states[this.currentType].nextType
            if (nextType !== undefined && nextType !== null) {
                this.changeWeapon(nextType)
            } else if (this.defaultType !== null) {
                this.changeWeapon(this.defaultType)
            } else throw "Not able to change weapon: nextType nor defaultType is specified"
        }
    }

    fire() {
        this.states[this.currentType].fireFn()
    }

}