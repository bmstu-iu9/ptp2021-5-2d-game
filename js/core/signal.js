import SignalBinding from "./signal_binding.js";

export default class Signal {
    constructor() {
        this._bindings = []
    }

    /**
     *
     * @param listener signal handler function
     * @param context context (value of 'this' keyword) on which listener would be executed
     * @returns {SignalBinding} a binding between this Signal and listener
     */
    addListener(listener, context = null) {
        if (typeof listener !== 'function')
            throw 'listener should be a function.'

        let binding = new SignalBinding(this, listener, context)
        this._bindings.push(binding)

        return binding
    }

    /**
     * Remove specified listener.
     *
     * @param listener handler function to be removed
     * @param context execution context (since you can add the same handler multiple times if executing in a
     * different context)
     */
    remove(listener, context = null) {
        for (let i = 0; i < this._bindings.length; i++) {
            if (this._bindings[i].listener === listener && this._bindings[i].context === context) {
                this._bindings[i].destroy()
                this._bindings[i].splice(i, 1)
            }
        }
    }

    dispatch(...paramsArray) {
        let bindings = this._bindings.slice(0)

        for (let i = 0; i < bindings.length; i++) {
            bindings[i].execute(paramsArray)
        }
    }
}