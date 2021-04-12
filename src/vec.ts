/** Shared base class of [Vec] and [Vec]. We do this instead of having
 * [Vec] inherit directly from [Vec] so that we can avoid it inheriting
 * an `==` operator, which would prevent it from being used in `switch`
 * statements. Instead, [Vec] uses identity equality.
 */
export class Vec {
  public x: number;
  public y: number;

  public static readonly zero = new Vec(0, 0);
  public static readonly none = new Vec(0, 0);
  public static readonly n = new Vec(0, -1);
  public static readonly ne = new Vec(1, -1);
  public static readonly e = new Vec(1, 0);
  public static readonly se = new Vec(1, 1);
  public static readonly s = new Vec(0, 1);
  public static readonly sw = new Vec(-1, 1);
  public static readonly w = new Vec(-1, 0);
  public static readonly nw = new Vec(-1, -1);
  /// The eight cardinal and intercardinal Vecs.
  public static readonly all = [
    Vec.n,
    Vec.ne,
    Vec.e,
    Vec.se,
    Vec.s,
    Vec.sw,
    Vec.w,
    Vec.nw,
  ];
  /// The four cardinal Vecs: north, south, east, and west.
  public static readonly cardinal = [Vec.n, Vec.e, Vec.s, Vec.w];
  /// The four Vecs between the cardinal ones: northwest, northeast,
  /// southwest and southeast.
  public static readonly intercardinal = [Vec.ne, Vec.se, Vec.sw, Vec.nw];

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  get hashCode() {
    // Map negative coordinates to positive and spread out the positive ones to
    // make room for them.
    const a = this.x >= 0 ? 2 * this.x : -2 * this.x - 1;
    const b = this.y >= 0 ? 2 * this.y : -2 * this.y - 1;

    // Cantor pairing function.
    // https://en.wikipedia.org/wiki/Pairing_function
    return Math.floor(((a + b) * (a + b + 1)) / 2) + b;
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

  /// The [Vec] that most closely approximates the angle of this Vec.
  ///
  /// In cases where two Vecs are equally close, chooses the one that is
  /// clockwise from this Vec's angle.
  ///
  /// In other words, it figures out which octant the vector's angle lies in
  /// (the dotted lines) and chooses the corresponding Vec:
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
        return Vec.n;
      } else if (this.y === 0) {
        return Vec.none;
      } else {
        return Vec.s;
      }
    }

    const slope = this.y / this.x;

    if (this.x < 0) {
      if (slope >= 2.0) {
        return Vec.n;
      } else if (slope >= 0.5) {
        return Vec.nw;
      } else if (slope >= -0.5) {
        return Vec.w;
      } else if (slope >= -2.0) {
        return Vec.sw;
      } else {
        return Vec.s;
      }
    } else {
      if (slope >= 2.0) {
        return Vec.s;
      } else if (slope >= 0.5) {
        return Vec.se;
      } else if (slope >= -0.5) {
        return Vec.e;
      } else if (slope >= -2.0) {
        return Vec.ne;
      } else {
        return Vec.n;
      }
    }
  }

  public add(other: Vec | number) {
    if (other instanceof Vec) {
      return new Vec(this.x + other.x, this.y + other.y);
    }
    return new Vec(this.x + other, this.y + other);
  }
  public subtract(other: Vec | number) {
    if (other instanceof Vec) {
      return new Vec(this.x - other.x, this.y - other.y);
    }
    return new Vec(this.x - other, this.y - other);
  }
  public multiply(other: Vec | number) {
    if (other instanceof Vec) {
      return new Vec(this.x * other.x, this.y * other.y);
    }
    return new Vec(this.x * other, this.y * other);
  }
  public divide(other: Vec | number) {
    if (other instanceof Vec) {
      return new Vec(Math.floor(this.x / other.x), Math.floor(this.y / other.y));
    }
    return new Vec(Math.floor(this.x / other), Math.floor(this.y / other));
  }
  public floor() {
    return new Vec(Math.floor(this.x), Math.floor(this.y));
  }

  public isEqual(other: Vec) {
    if (!other) {
      return false;
    }
    return other.x === this.x && other.y === this.y;
  }

  /// Returns `true` if the magnitude of this vector is greater than [other].
  public isGreaterThan(other: Vec | number) {
    if (other instanceof Vec) {
      return this.lengthSquared > other.lengthSquared
    }
    return this.lengthSquared > other * other
  }
  public isGreaterThanOrEqual(other: Vec | number) {
    if (other instanceof Vec) {
      return this.lengthSquared >= other.lengthSquared
    }
    return this.lengthSquared >= other * other
  }

  public isLessThan(other: Vec | number) {
    if (other instanceof Vec) {
      return this.lengthSquared < other.lengthSquared
    }
    return this.lengthSquared < other * other
  }
  public isLessThanOrEqual(other: Vec | number) {
    if (other instanceof Vec) {
      return this.lengthSquared <= other.lengthSquared
    }
    return this.lengthSquared <= other * other
  }

  /// The eight Vecs surrounding this one to the north, south, east, and west
  /// and points in between.
  public get neighbors(): Vec[] {
    return Vec.all.map((a) => this.add(a));
  }

  /// The four Vecs surrounding this one to the north, south, east, and west.
  public get cardinalNeighbors(): Vec[] {
    return Vec.cardinal.map((a) => this.add(a));
  }

  /// The four Vecs surrounding this one to the northeast, southeast, southwest,
  /// and northwest.
  public get intercardinalNeighbors(): Vec[] {
    return Vec.intercardinal.map((a) => this.add(a));
  }

  /// Returns `true` if [pos] is within a rectangle from (0,0) to this vector
  /// (half-inclusive).
  public contains(pos: Vec) {
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
    return `${this.x}, ${this.y}`;
  }
}
