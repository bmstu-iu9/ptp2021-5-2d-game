import StaticClass from "./static_class.js";

export default class Chance extends StaticClass {
    static randomRange(min, max) {
        return Math.round(Math.random() * (max - min)) + min
    }

    static oneIn(value) {
        return Chance.randomRange(1, value) === 1
    }
}
