/// A two-dimensional fixed-size array of elements of type [T].
///
/// This class doesn't follow matrix notation which tends to put the column
/// index before the row. Instead, it mirrors graphics and games where x --
/// the horizontal component -- comes before y.
///
/// Internally, the elements are stored in a single contiguous list in row-major

import { createArray, fillArray } from './utils';

import { ListIterator } from './ListIterator';
import { Rect } from './Rect';
import { Vec } from './vec';

/// order.
export class Array2D<T> implements Iterable<T> {
  /// The number of elements in a row of the array.
  get width() {
    return this.bounds.width;
  }

  /// The number of elements in a column of the array.
  get height() {
    return this.bounds.height;
  }

  readonly _elements: T[];

  /// Creates a new array with [width], [height] elements initialized to
  /// [value].
  constructor(width: number, height: number, valueOrGenerator: T | ((v: Vec) => T)) {
    this.bounds = new Rect(0, 0, width, height);
    if (valueOrGenerator instanceof Function) {
      this._elements = width * height > 0 ? createArray(width * height, valueOrGenerator(Vec.zero)) : [];
      // Don't call generator() on the first cell twice.
      for (let x = 1; x < width; x++) {
        this.set(x, 0, valueOrGenerator(new Vec(x, 0)));
      }

      for (let y = 1; y < height; y++) {
        for (let x = 0; x < width; x++) {
          this.set(x, y, valueOrGenerator(new Vec(x, y)));
        }
      }
    } else {
      this._elements = createArray(width * height, valueOrGenerator);
    }
  }

  /// Gets the element at [pos].
  at(pos: Vec) {
    return this.get(pos.x, pos.y);
  }

  /// A [Rect] whose bounds cover the full range of valid element indexes.
  readonly bounds: Rect;
  // Store the bounds rect instead of simply the width and height because this
  // is accessed very frequently and avoids allocating a new Rect each time.

  /// The size of the array.
  get size() {
    return this.bounds.size;
  }

  /// Gets the element in the array at [x], [y].
  get(x: number, y: number) {
    this._checkBounds(x, y);
    return this._elements[y * this.width + x];
  }

  /// Sets the element in the array at [x], [y] to [value].
  set(x: number, y: number, value: T) {
    this._checkBounds(x, y);
    this._elements[y * this.width + x] = value;
  }

  /// Sets every element to [value].
  fill(value: T) {
    fillArray(this._elements, 0, this._elements.length, value);
  }

  /// Evaluates [generator] on each position in the array and sets the element
  /// at that position to the result.
  generate(generator: (v: Vec) => T) {
    for (const pos of this.bounds) {
      this.set(pos.x, pos.y, generator(pos));
    }
  }

  [Symbol.iterator]() {
    return new ListIterator(this._elements);
  }

  _checkBounds(x: number, y: number) {
    if (x < 0 || x >= this.width) throw new RangeError(`x is ${x}`);
    if (y < 0 || y >= this.height) throw new RangeError(`y is ${y}`);
  }
}
