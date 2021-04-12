import { RectIterator } from './rectiterator';
import { Vec } from './vec';
import { clamp } from './utils';

/// A two-dimensional immutable rectangle with integer coordinates.
///
/// Many operations treat a [Rect] as a collection of discrete points. In those
/// cases, the boundaries of the rect are two half-open intervals when
/// determining which points are inside the rect. For example, consider the
/// rect whose coordinates are (-1, 1)-(3, 4):
///
///      -2 -1  0  1  2  3  4
///       |  |  |  |  |  |  |
///     0-
///     1-   +-----------+
///     2-   |           |
///     3-   |           |
///     4-   +-----------+
///     5-
///
/// It contains all points within that region except for the ones that lie
/// directly on the right and bottom edges. (It's always right and bottom,
/// even if the rectangle has negative coordinates.) In the above examples,
/// that's these points:
///
///      -2 -1  0  1  2  3  4
///       |  |  |  |  |  |  |
///     0-
///     1-   *--*--*--*--+
///     2-   *  *  *  *  |
///     3-   *  *  *  *  |
///     4-   +-----------+
///     5-
///
/// This seems a bit odd, but does what you want in almost all respects. For
/// example, the width of this rect, determined by subtracting the left
/// coordinate (-1) from the right (3) is 4 and indeed it contains four columns
/// of points.
export class Rect implements Iterable<Vec> {
  /// Gets the empty rectangle.
  static empty = Rect.posAndSize(Vec.zero, Vec.zero);

  /// Creates a new rectangle that is the intersection of [a] and [b].
  ///
  ///     .----------.
  ///     | a        |
  ///     | .--------+----.
  ///     | | result |  b |
  ///     | |        |    |
  ///     '-+--------'    |
  ///       |             |
  ///       '-------------'
  public static intersect(a: Rect, b: Rect) {
    const left = Math.max(a.left, b.left);
    const right = Math.min(a.right, b.right);
    const top = Math.max(a.top, b.top);
    const bottom = Math.min(a.bottom, b.bottom);

    const width = Math.max(0, right - left);
    const height = Math.max(0, bottom - top);

    return new Rect(left, top, width, height);
  }

  static centerIn(toCenter: Rect, main: Rect): Rect {
    const pos = main.size.subtract(toCenter.size).divide(new Vec(2, 2)).floor();
    return Rect.posAndSize(pos, toCenter.size);
  }

  public pos: Vec;
  public size: Vec;

  get x() {
    return this.pos.x;
  }
  get y() {
    return this.pos.y;
  }
  get width() {
    return this.size.x;
  }
  get height() {
    return this.size.y;
  }

  // Use min and max to handle negative sizes.

  get left() {
    return Math.min(this.x, this.x + this.width);
  }
  get top() {
    return Math.min(this.y, this.y + this.height);
  }
  get right() {
    return Math.max(this.x, this.x + this.width);
  }
  get bottom() {
    return Math.max(this.y, this.y + this.height);
  }

  get topLeft() {
    return new Vec(this.left, this.top);
  }
  get topRight() {
    return new Vec(this.right, this.top);
  }
  get bottomLeft() {
    return new Vec(this.left, this.bottom);
  }
  get bottomRight() {
    return new Vec(this.right, this.bottom);
  }

  get center() {
    return new Vec(Math.floor((this.left + this.right) / 2), Math.floor((this.top + this.bottom) / 2));
  }

  get area() {
    return this.size.area;
  }

  public static posAndSize(pos: Vec, size: Vec) {
    return new Rect(pos.x, pos.y, size.x, size.y);
  }

  public static leftTopRightBottom(left: number, top: number, right: number, bottom: number) {
    const pos = new Vec(left, top);
    const size = new Vec(right - left, bottom - top);
    return this.posAndSize(pos, size);
  }

  constructor(_x: number, _y: number, width: number, height: number) {
    this.pos = new Vec(_x, _y);
    this.size = new Vec(width, height);
  }

  /// Creates a new rectangle a single row in height, as wide as [size],
  /// with its top left corner at [pos].
  public static row(_x: number, _y: number, size: number) {
    return new Rect(_x, _y, size, 1);
  }

  /// Creates a new rectangle a single column in width, as tall as [size],
  /// with its top left corner at [pos].
  public static column(_x: number, _y: number, size: number) {
    return new Rect(_x, _y, 1, size);
  }

  public toString() {
    return `(${this.pos.toString()})-(${this.size.toString()})`;
  }

  public inflate(distance: number) {
    return new Rect(this.x - distance, this.y - distance, this.width + distance * 2, this.height + distance * 2);
  }

  public offset(x: number, y: number) {
    return new Rect(this.x + x, this.y + y, this.width, this.height);
  }

  public contains(object: Vec) {
    if (object.x < this.pos.x) return false;
    if (object.x >= this.pos.x + this.size.x) return false;
    if (object.y < this.pos.y) return false;
    if (object.y >= this.pos.y + this.size.y) return false;

    return true;
  }

  public containsRect(rect: Rect) {
    if (rect.left < this.left) return false;
    if (rect.right > this.right) return false;
    if (rect.top < this.top) return false;
    if (rect.bottom > this.bottom) return false;

    return true;
  }

  /// Returns a new [Vec] that is as near to [vec] as possible while being in
  /// bounds.
  public clamp(vec: Vec) {
    const x = Math.floor(clamp(vec.x, this.left, this.right));
    const y = Math.floor(clamp(vec.y, this.top, this.bottom));
    return new Vec(x, y);
  }

  [Symbol.iterator]() {
    return new RectIterator(this);
  }

  /// Returns the distance between this Rect and [other]. This is minimum
  /// length that a corridor would have to be to go from one Rect to the other.
  /// If the two Rects are adjacent, returns zero. If they overlap, returns -1.
  public distanceTo(other: Rect) {
    let vertical;
    if (this.top >= other.bottom) {
      vertical = this.top - other.bottom;
    } else if (this.bottom <= other.top) {
      vertical = other.top - this.bottom;
    } else {
      vertical = -1;
    }

    let horizontal;
    if (this.left >= other.right) {
      horizontal = this.left - other.right;
    } else if (this.right <= other.left) {
      horizontal = other.left - this.right;
    } else {
      horizontal = -1;
    }

    if (vertical === -1 && horizontal === -1) return -1;
    if (vertical === -1) return horizontal;
    if (horizontal === -1) return vertical;
    return horizontal + vertical;
  }

  /// Iterates over the points along the edge of the Rect.
  public trace() {
    if (this.width > 1 && this.height > 1) {
      // TODO(bob): Implement an iterator class here if building the list is
      // slow.
      // Trace all four sides.
      const result: Vec[] = [];

      for (let x = this.left; x < this.right; x++) {
        result.push(new Vec(x, this.top));
        result.push(new Vec(x, this.bottom - 1));
      }

      for (let y = this.top + 1; y < this.bottom - 1; y++) {
        result.push(new Vec(this.left, y));
        result.push(new Vec(this.right - 1, y));
      }

      return result;
    } else if (this.width > 1 && this.height === 1) {
      // A single row.
      return Rect.row(this.left, this.top, this.width);
    } else if (this.height >= 1 && this.width === 1) {
      // A single column, or one unit
      return Rect.column(this.left, this.top, this.height);
    }

    // Otherwise, the rect doesn't have a positive size, so there's nothing to
    // trace.
    return [];
  }

  // TODO: Equality operator and hashCode.
}
