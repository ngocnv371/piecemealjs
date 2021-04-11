import { Iterator } from './iterator';
import { sign } from './utils';
import { Vec } from './vec';

export class LineIterator implements Iterator<Vec> {
  _current: Vec;
  _error: number;
  _primary: number;
  _secondary: number;

  /// Unit vector for the primary direction the line is moving. It advances one
  /// unit this direction each step.
  _primaryStep: Vec;

  /// Unit vector for the primary direction the line is moving. It advances one
  /// unit this direction when the accumulated error overflows.
  _secondaryStep: Vec;

  constructor(start: Vec, end: Vec) {
    let delta = end.subtract(start);
    // Figure which octant the line is in and increment appropriately.
    let primaryStep = new Vec(sign(delta.x), 0);
    let secondaryStep = new Vec(0, sign(delta.y));

    // Discard the signs now that they are accounted for.
    delta = delta.abs();

    // Assume moving horizontally each step.
    let primary = delta.x;
    let secondary = delta.y;

    // Swap the order if the y magnitude is greater.
    if (delta.y > delta.x) {
      const temp = primary;
      primary = secondary;
      secondary = temp;

      const tempIncrement = primaryStep;
      primaryStep = secondaryStep;
      secondaryStep = tempIncrement;
    }

    this._current = start;
    this._error = 0;
    this._primary = primary;
    this._secondary = secondary;
    this._primaryStep = primaryStep;
    this._secondaryStep = secondaryStep;
  }

  current(): Vec {
    return this._current;
  }

  /// Always returns `true` to allow a line to overshoot the end point. Make
  /// sure you terminate iteration yourself.
  moveNext(): boolean {
    this._current = this._current.add(this._primaryStep);

    // See if we need to step in the secondary direction.
    this._error += this._secondary;
    if (this._error * 2 >= this._primary) {
      this._current = this._current.add(this._secondaryStep);
      this._error -= this._primary;
    }

    return true;
  }
}
