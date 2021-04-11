import { Circle } from './Circle';
import { Iterator } from './iterator';
import { Rect } from './rect';
import { radiusSquared } from './utils';
import { Vec } from './vec';

export class CircleIterator implements Iterator<Vec> {
  readonly _circle: Circle;
  readonly _boundsIterator: Iterator<Vec>;
  readonly _edge: boolean;

  constructor(circle: Circle, edge: boolean) {
    const size = circle.radius + circle.radius + 1;
    const bounds = new Rect(-circle.radius, -circle.radius, size, size);
    this._circle = circle;
    this._boundsIterator = bounds.iterator;
    this._edge = edge;
  }

  current() {
    return this._boundsIterator.current().add(this._circle.center);
  }

  moveNext() {
    while (true) {
      if (!this._boundsIterator.moveNext()) return false;
      const length = this._boundsIterator.current().lengthSquared;

      if (length > radiusSquared(this._circle.radius)) continue;
      if (this._edge && this._circle.radius > 0 && length < radiusSquared(this._circle.radius - 1)) continue;

      break;
    }

    return true;
  }
}
