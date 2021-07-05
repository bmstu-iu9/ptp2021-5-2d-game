const POSSIBLE_EVENTS = [
    "destroyed"
]

export class EventManager {
    constructor() {
        this.eventStore = new Map()
        for (let eventName of POSSIBLE_EVENTS) {
            this.eventStore.set(eventName, [])
        }
    }

    addListener(eventName, fn) {
        this.eventStore.get(eventName).push(fn)
    }

    emit(eventName, sender, params) {
        if (!this.eventStore.has(eventName)) {
            throw "No such event: " + eventName
        }

        for (let listener of this.eventStore.get(eventName)) {
            listener(sender, params)
        }
    }
}
