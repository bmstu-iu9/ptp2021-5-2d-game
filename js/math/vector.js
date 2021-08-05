/**
 * A class representing a 2D vector.
 */
export default class Vector {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    /**Returns the length of this Vector.
     *
     * @returns {number} the length of this Vector.
     */
    get length() {
        return accurate(Math.sqrt(this.x ** 2 + this.y ** 2))
    }

    /**Sets the length of this Vector.
     *
     * @param length required length
     */
    set length(length) {
        this.normalize().scale(length)
    }

    /**Calculate the angle between this Vector and positive X-axis in radians.
     *
     * @returns {number} the angle between this Vector and positive X-axis in radians.
     */
    get angle() {
        let result = Math.atan2(this.y, this.x)

        if (result < 0) {
            result += 2 * Math.PI
        }

        return accurate(result)
    }

    /**Set the angle of this Vector.
     *
     * @param angle the angle in radians
     */
    set angle(angle) {
        this.x = this.length * accurate(Math.cos(angle))
        this.y = this.length * accurate(Math.sin(angle))
    }

    setTo(x, y) {
        this.x = x
        this.y = y
    }

    /**Make a clone of this Vector.
     *
     * @returns {Vector} a clone of this Vector.
     */
    clone() {
        return new Vector(this.x, this.y)
    }

    /**Scale this Vector by the given value.
     *
     * @param factor value to scale the vector by
     * @returns {Vector}
     */
    scale(factor) {
        this.x *= factor
        this.y *= factor

        return this
    }

    /**Normalize this vector.
     * Makes the Vector's length equal to 1 while facing in the same direction.
     *
     * @returns {Vector} this Vector
     */
    normalize() {
        let len = this.x ** 2 + this.y ** 2

        if (accurate(len) > 0) {
            len = 1 / Math.sqrt(len)

            this.x *= len
            this.y *= len
        }

        return this
    }

    /**Limit the length of this Vector
     *
     * @param max maximum length value
     * @returns {Vector} this Vector
     */
    limit(max) {
        let len = this.length

        if (len && len > max) {
            this.scale(max / len)
        }

        return this
    }

    /**Add a given Vector to this Vector.
     *
     * @param other the Vector to add to this Vector
     * @returns {Vector} this Vector
     */
    add(other) {
        this.x += other.x
        this.y += other.y

        return this
    }

    /**Subtract a given Vector from this Vector.
     *
     * @param other the Vector to subtract from this Vector
     * @returns {Vector} this Vector
     */
    subtract(other) {
        this.x -= other.x
        this.y -= other.y

        return this
    }

    /**Negate the 'x' and 'y' components of this Vector
     *
     * @returns {Vector} this Vector
     */
    negate() {
        this.x = -this.x
        this.y = -this.y

        return this
    }

    /**Calculate the dot product of this Vector and the given Vector.
     *
     * @param other the Vector to compute dot product with
     * @returns {number} the dot product
     */
    dot(other) {
        return this.x * other.x + this.y * other.y
    }

    /**Calculate distance between this Vector and other Vector.
     *
     * @param other {Vector} vector to calculate the distance to
     * @returns {number} the resulting distance
     */
    distanceBetween(other) {
        let dx = other.x - this.x,
            dy = other.y - this.y;

        return Math.sqrt(dx * dx + dy * dy);
    }

    /**Calculate the angle between this Vector and other Vector.
     *
     * @param other {Vector} Vector to calculate the angle to
     * @returns {number} resulting angle in radians
     */
    angleBetween(other) {
        if (this.length === 0 || other.length === 0) {
            return this.angle || other.angle
        }

        let inner = this.dot(other) / (this.length * other.length)
        return accurate(Math.cos(inner))
    }

    /**Linearly interpolate between this Vector and the given vector.
     *
     * @param target {Vector} the Vector to interpolate towards.
     * @param t {number} the interpolation percentage, between 0 and 1.
     * @returns {Vector} this Vector
     */
    lerp(target, t = 0) {
        this.x += t * (target.x - this.x)
        this.y += t * (target.y - this.y)

        return this
    }
}

const accurate = (x) => {
    return Math.abs(x) < Number.EPSILON ? 0 : x
}