import { Rect } from './Rect';
import { Vec } from './vec';

function random(max?: number) {
  if (max === undefined) {
    return Math.random();
  }
  return Math.floor(Math.random() * max);
}

export class Rng {
  /**
   * Gets a random within a given range. If [max] is given, then it is
   * in the range `[minOrMax, max)`. Otherwise, it is `[0, minOrMax)`. In
   * other words, `range(3)` returns a `0`, `1`, or `2`, and `range(2, 5)`
   * returns `2`, `3`, or `4`.
   */
  range(minOrMax: number, max?: number) {
    if (max === undefined) {
      max = minOrMax;
      minOrMax = 0;
    }

    return random(max - minOrMax) + minOrMax;
  }

  /**
   * Gets a random within a given range. If [max] is given, then it is
   * in the range `[minOrMax, max]`. Otherwise, it is `[0, minOrMax]`. In
   * other words, `inclusive(2)` returns a `0`, `1`, or `2`, and
   * `inclusive(2, 4)` returns `2`, `3`, or `4`.
   */
  inclusive(minOrMax: number, max?: number) {
    if (max === undefined) {
      max = minOrMax;
      minOrMax = 0;
    }

    max++;
    return random(max - minOrMax) + minOrMax;
  }

  /**
   *  Gets a random floating-povalue within the given range.
   */
  float(minOrMax?: number, max?: number) {
    if (minOrMax === undefined) {
      return random();
    } else if (max === undefined) {
      return random() * minOrMax;
    } else {
      return random() * (max - minOrMax) + minOrMax;
    }
  }

  /**
   * Gets a random integer count within the given floating po[range].
   *
   * The decimal portion of the range is treated as a fractional chance of
   * returning the next higher integer value. For example:
   *
   *     countFromFloat(10.2);
   *
   * This has an 80% chance of returning 10 and a 20% chance of returning 11.
   *
   * This is particularly useful when the range is less than one, because it
   * gives you some chance of still producing one instead of always rounding
   * down to zero.
   */
  countFromFloat(range: number) {
    let count = Math.floor(range);
    if (this.float(1.0) < range - count) count++;
    return count;
  }

  /**
   * Calculate a random number with a normal distribution.
   *
   * Note that this means results may be less than -1.0 or greater than 1.0.
   *
   * Uses https://en.wikipedia.org/wiki/Marsaglia_polar_method.
   */
  normal() {
    let u;
    let v;
    let lengthSquared;

    do {
      u = this.float(-1.0, 1.0);
      v = this.float(-1.0, 1.0);
      lengthSquared = u * u + v * v;
    } while (lengthSquared >= 1.0);

    return u * Math.sqrt((-2.0 * Math.log(lengthSquared)) / lengthSquared);
  }

  /**
   * Returns `true` if a random chosen between 1 and chance was 1.
   */
  oneIn(chance: number) {
    return this.range(chance) === 0;
  }

  /**
   * Returns `true` [chance] percent of the time.
   */
  percent(chance: number) {
    return this.range(100) < chance;
  }

  /**
   * Rounds [value] to a nearby integer, randomly rounding up or down based
   * on the fractional value.
   *
   * For example, `round(3.2)` has a 20% chance of returning 3, and an 80%
   * chance of returning 4.
   */
  round(value: number) {
    let result = Math.floor(value);
    if (this.float(1.0) < value - result) result++;
    return result;
  }

  /**
   * Gets a random item from the given list.
   */
  item<T>(items: T[]) {
    return items[this.range(items.length)];
  }

  /**
   * Removes a random item from the given list.
   *
   * This may not preserve the order of items in the list, but is faster than
   * [takeOrdered].
   */
  take<T>(items: T[]) {
    const index = this.range(items.length);
    const result = items[index];

    // Replace the removed item with the last item in the list and then discard
    // the last.
    const last = items.pop();
    if (last) {
      items[index] = last;
    }

    return result;
  }

  /**
   * Removes a random item from the given list, preserving the order of the
   * remaining items.
   *
   * This is O(n) because it must shift forward items after the removed one.
   * If you don't need to preserve order, use [take].
   */
  takeOrdered<T>(items: T[]) {
    const index = this.range(items.length);
    const value = items[index];
    items.splice(index, 1);
    return value;
  }

  /**
   * Randomly re-orders elements in [items].
   */
  shuffle<T>(items: T[]) {
    items.sort(() => random());
  }

  /**
   * Gets a random [Vec] within the given [Rect] (half-inclusive).
   */
  vecInRect(rect: Rect) {
    return new Vec(this.range(rect.left, rect.right), this.range(rect.top, rect.bottom));
  }

  /**
   * Gets a random number centered around [center] with [range] (inclusive)
   * using a triangular distribution. For example `triangleInt(8, 4)` will
   * return values between 4 and 12 (inclusive) with greater distribution
   * towards 8.
   *
   * This means output values will range from `(center - range)` to
   * `(center + range)` inclusive, with most values near the center, but not
   * with a normal distribution. Think of it as a poor man's bell curve.
   *
   * The algorithm works essentially by choosing a random poinside the
   * triangle, and then calculating the x coordinate of that point. It works
   * like this:
   *
   * Consider Center 4, Range 3:
   *
   *             *
   *           * | *
   *         * | | | *
   *       * | | | | | *
   *     --+-----+-----+--
   *     0 1 2 3 4 5 6 7 8
   *      -r     c     r
   *
   * Now flip the left half of the triangle (from 1 to 3) vertically and move
   * it over to the right so that we have a square.
   *
   *         .-------.
   *         |       V
   *         |
   *         |   R L L L
   *         | . R R L L
   *         . . R R R L
   *       . . . R R R R
   *     --+-----+-----+--
   *     0 1 2 3 4 5 6 7 8
   *
   * Choose a poin that square. Figure out which half of the triangle the
   * pois in, and then remap the poback out to the original triangle.
   * The result is the *x* coordinate of the poin the original triangle.
   */
  triangleInt(center: number, range: number) {
    if (range < 0) {
      throw Error('The argument "range" must be zero or greater.');
    }

    // Pick a poin the square.
    const x = this.inclusive(range);
    const y = this.inclusive(range);

    // Figure out which triangle we are in.
    if (x <= y) {
      // Larger triangle.
      return center + x;
    } else {
      // Smaller triangle.
      return center - range - 1 + x;
    }
  }

  taper(start: number, chanceOfIncrement: number) {
    while (this.oneIn(chanceOfIncrement)) start++;
    return start;
  }
}
