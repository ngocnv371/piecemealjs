import { Direction } from './direction';
import { Vec } from './vec';

/** Shared base class of [Vec] and [Direction]. We do this instead of having
 * [Direction] inherit directly from [Vec] so that we can avoid it inheriting
 * an `==` operator, which would prevent it from being used in `switch`
 * statements. Instead, [Direction] uses identity equality.
 */
export class VecBase {
  public x: number;
  public y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  /// Gets the area of a [Rect] whose corners are (0, 0) and this Vec.
  ///
  /// Returns a negative area if one of the Vec's coordinates are negative.
  public get area() {
    return this.x * this.y;
  }

  /// Gets the rook length of the Vec, which is the number of squares a rook on
  /// a chessboard would need to move from (0, 0) to reach the endpoint of the
  /// Vec. Also known as Manhattan or taxicab distance.
  public get rookLength() {
    return Math.abs(this.x) + Math.abs(this.y);
  }

  /// Gets the king length of the Vec, which is the number of squares a king on
  /// a chessboard would need to move from (0, 0) to reach the endpoint of the
  /// Vec. Also known as Chebyshev distance.
  public get kingLength() {
    return Math.max(Math.abs(this.x), Math.abs(this.y));
  }

  public get lengthSquared() {
    return this.x * this.x + this.y * this.y;
  }

  /// The Cartesian length of the vector.
  ///
  /// If you just need to compare the magnitude of two vectors, prefer using
  /// the comparison operators or [lengthSquared], both of which are faster
  /// than this.
  public get length() {
    return Math.sqrt(this.lengthSquared);
  }

  /// The [Direction] that most closely approximates the angle of this Vec.
  ///
  /// In cases where two directions are equally close, chooses the one that is
  /// clockwise from this Vec's angle.
  ///
  /// In other words, it figures out which octant the vector's angle lies in
  /// (the dotted lines) and chooses the corresponding direction:
  ///
  ///               n
  ///      nw   2.0  -2.0  ne
  ///         \  '  |  '  /
  ///          \    |    /
  ///      0.5  \ ' | ' /   -0.5
  ///         '  \  |  /  '
  ///           ' \'|'/ '
  ///             '\|/'
  ///       w ------0------ e
  ///             '/|\'
  ///           ' /'|'\ '
  ///         '  /  |  \  '
  ///     -0.5  / ' | ' \   0.5
  ///          /    |    \
  ///         /  '  |  '  \
  ///       sw -2.0   2.0  se
  ///               s
  public get nearestDirection() {
    if (this.x === 0) {
      if (this.y < 0) {
        return Direction.n;
      } else if (this.y === 0) {
        return Direction.none;
      } else {
        return Direction.s;
      }
    }

    const slope = this.y / this.x;

    if (this.x < 0) {
      if (slope >= 2.0) {
        return Direction.n;
      } else if (slope >= 0.5) {
        return Direction.nw;
      } else if (slope >= -0.5) {
        return Direction.w;
      } else if (slope >= -2.0) {
        return Direction.sw;
      } else {
        return Direction.s;
      }
    } else {
      if (slope >= 2.0) {
        return Direction.s;
      } else if (slope >= 0.5) {
        return Direction.se;
      } else if (slope >= -0.5) {
        return Direction.e;
      } else if (slope >= -2.0) {
        return Direction.ne;
      } else {
        return Direction.n;
      }
    }
  }

  public add(other: VecBase | number) {
    if (other instanceof VecBase) {
      return new Vec(this.x + other.x, this.y + other.y);
    }
    return new Vec(this.x + other, this.y + other);
  }
  public subtract(other: VecBase | number) {
    if (other instanceof VecBase) {
      return new Vec(this.x - other.x, this.y - other.y);
    }
    return new Vec(this.x - other, this.y - other);
  }
  public multiply(other: VecBase | number) {
    if (other instanceof VecBase) {
      return new Vec(this.x * other.x, this.y * other.y);
    }
    return new Vec(this.x * other, this.y * other);
  }
  public divide(other: VecBase | number) {
    if (other instanceof VecBase) {
      return new Vec(this.x / other.x, this.y / other.y);
    }
    return new Vec(this.x / other, this.y / other);
  }
  public floor() {
    return new Vec(Math.floor(this.x), Math.floor(this.y));
  }

  public isEqual(other: VecBase) {
    if (!other) {
      return false;
    }
    return other.x === this.x && other.y === this.y;
  }

  /// Returns `true` if the magnitude of this vector is greater than [other].
  public isGreaterThan(other: VecBase | number) {
    if (other instanceof VecBase) {
      return this.lengthSquared > other.lengthSquared
    }
    return this.lengthSquared > other * other
  }
  public isGreaterThanOrEqual(other: VecBase | number) {
    if (other instanceof VecBase) {
      return this.lengthSquared >= other.lengthSquared
    }
    return this.lengthSquared >= other * other
  }

  public isLessThan(other: VecBase | number) {
    if (other instanceof VecBase) {
      return this.lengthSquared < other.lengthSquared
    }
    return this.lengthSquared < other * other
  }
  public isLessThanOrEqual(other: VecBase | number) {
    if (other instanceof VecBase) {
      return this.lengthSquared <= other.lengthSquared
    }
    return this.lengthSquared <= other * other
  }

  /// The eight Vecs surrounding this one to the north, south, east, and west
  /// and points in between.
  public get neighbors(): Vec[] {
    return Direction.all.map((a) => this.add(a));
  }

  /// The four Vecs surrounding this one to the north, south, east, and west.
  public get cardinalNeighbors(): Vec[] {
    return Direction.cardinal.map((a) => this.add(a));
  }

  /// The four Vecs surrounding this one to the northeast, southeast, southwest,
  /// and northwest.
  public get intercardinalNeighbors(): Vec[] {
    return Direction.intercardinal.map((a) => this.add(a));
  }

  /// Returns `true` if [pos] is within a rectangle from (0,0) to this vector
  /// (half-inclusive).
  public contains(pos: VecBase) {
    const left = Math.min(0, this.x);
    if (pos.x < left) return false;

    const right = Math.max(0, this.x);
    if (pos.x >= right) return false;

    const top = Math.min(0, this.y);
    if (pos.y < top) return false;

    const bottom = Math.max(0, this.y);
    if (pos.y >= bottom) return false;

    return true;
  }

  /// Returns a new [Vec] with the absolute value of the coordinates of this
  /// one.
  public abs() {
    return new Vec(Math.abs(this.x), Math.abs(this.y));
  }

  /// Returns a new [Vec] whose coordinates are this one's translated by [x] and
  /// [y].
  public offset(x: number, y: number) {
    return new Vec(this.x + x, this.y + y);
  }

  /// Returns a new [Vec] whose coordinates are this one's but with the X
  /// coordinate translated by [x].
  public offsetX(x: number) {
    return new Vec(this.x + x, this.y);
  }

  /// Returns a new [Vec] whose coordinates are this one's but with the Y
  /// coordinate translated by [y].
  public offsetY(y: number) {
    return new Vec(this.x, this.y + y);
  }

  public toString() {
    return '$x, $y';
  }
}
