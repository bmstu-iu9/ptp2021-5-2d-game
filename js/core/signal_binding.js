export default class SignalBinding {
    constructor(signal, listener, listenerContext) {
        this._signal = signal
        this._listener = listener
        this.context = listenerContext
    }

    get listener() {
        return this._listener
    }

    get signal() {
        return this._signal
    }

    /**
     * Calls listener with passed parameters.
     *
     * @param paramsArray params that should be passed to listener
     * @returns {*} value returned by listener
     */
    execute(paramsArray) {
        return this._listener.apply(this.context, paramsArray)
    }

    /**
     * Detach this binding from its signal.
     */
    detach() {
        this._signal.remove(this._listener, this.context)
    }

    destroy() {}
}