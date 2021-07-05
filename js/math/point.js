/**Just a point.
 *
 */
export class Point {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    /**Clones this Point.
     *
     * @returns {Point} a clone of this Point
     */
    clone() {
        return new Point(this.x, this.y)
    }

    /**Moves the Point by the Vector.
     *
     * @param v Vector to move the point by
     * @returns {Point} this Point
     */
    moveBy(v) {
        this.x += v.x
        this.y += v.y

        return this
    }
}