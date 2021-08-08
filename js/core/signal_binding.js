export default class SignalBinding {
    constructor(signal, listener, listenerContext) {
        this.signal = signal
        this.listener = listener
        this.context = listenerContext
    }

    /**
     * Calls listener with passed parameters.
     *
     * @param paramsArray params that should be passed to listener
     * @returns {*} value returned by listener
     */
    execute(paramsArray) {
        return this.listener.apply(this.context, paramsArray)
    }

    /**
     * Detach this binding from its signal.
     */
    detach() {
        this.signal.remove(this.listener, this.context)
    }

    destroy() {
    }
}
