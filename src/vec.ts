import { VecBase } from './vecbase';

/**
 * A two-dimensional point.
 */
export class Vec extends VecBase {
  public static readonly zero = new Vec(0, 0);

  get hashCode() {
    // Map negative coordinates to positive and spread out the positive ones to
    // make room for them.
    const a = this.x >= 0 ? 2 * this.x : -2 * this.x - 1;
    const b = this.y >= 0 ? 2 * this.y : -2 * this.y - 1;

    // Cantor pairing function.
    // https://en.wikipedia.org/wiki/Pairing_function
    return Math.floor(((a + b) * (a + b + 1)) / 2) + b;
  }

  constructor(x: number, y: number) {
    super(x, y);
  }

  public isEquals(other: any) {
    if (!other) {
      return false;
    }
    return other.x === this.x && other.y === this.y;
  }
}
