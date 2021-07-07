const POSSIBLE_EVENTS = [
    "destroyed"
]

export class EventManager {
    constructor() {
        this.eventStore = []
        for (let eventName of POSSIBLE_EVENTS) {
            this.eventStore[eventName] = []
        }
    }

    addListener(eventName, fn) {
        if (!(eventName in this.eventStore)) {
            throw "No such event: " + eventName
        }

        this.eventStore[eventName].push(fn)
    }

    emit(eventName, sender, params) {
        if (!(eventName in this.eventStore)) {
            throw "No such event: " + eventName
        }

        for (let listener of this.eventStore.get(eventName)) {
            listener(sender, params)
        }
    }
}
