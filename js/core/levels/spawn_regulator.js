import StaticClass from "../../util/static_class.js";

/**
 * Select an item from set according to the item's drop chances.
 */
export default class SpawnRegulator extends StaticClass {
    static lerp(min, max, value) {
        return ((1 - value) * min + value * max)
    }

    // each item in items is presented with a name and a drop chance
    static selector(items) {
        const total = items.reduce((accumulator, item) => (accumulator += item.dropChance), 0);
        const chance = this.lerp(0, total, Math.random());

        let current = 0;
        for (const item of items) {
            if (current <= chance && chance < current + item.dropChance) {
                return item;
            }
            current += item.dropChance;
        }
    }
}
