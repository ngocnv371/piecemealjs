import { Vec } from './vec';
import { IterableBase } from './IterableBase';
import { radiusSquared } from './utils';
import { CircleIterator } from './CircleIterator';

export class Circle extends IterableBase<Vec> {
  /// The position of the center of the circle.
  readonly center: Vec;

  /// The radius of this Circle.
  readonly radius: number;

  constructor(center: Vec, radius: number) {
    super();
    this.center = center;
    this.radius = radius;
    if (radius < 0) throw Error('The radius cannot be negative.');
  }

  /// Gets whether [pos] is in the outermost edge of the circle.
  isEdge(pos: Vec) {
    let leadingEdge = true;
    if (this.radius > 0) {
      leadingEdge = pos.subtract(this.center).isGreaterThan(radiusSquared(this.radius - 1));
    }

    return leadingEdge;
  }

  get iterator() {
    return new CircleIterator(this, false);
  }

  /// Traces the outside edge of the circle.
  get edge() {
    return new CircleIterator(this, true);
  }
}
