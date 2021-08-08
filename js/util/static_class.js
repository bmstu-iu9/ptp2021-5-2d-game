/**
 * <p>A base class for all **static classes**.
 * <p>If your class has only static properties and methods and you
 * don't want anyone to instantiate your class, your class should inherit from **StaticClass**.
 */
export default class StaticClass {
    /**
     * You should not instantiate this class because it's static.
     */
    constructor() {
        throw "You cannot instantiate this class because it's static."
    }
}