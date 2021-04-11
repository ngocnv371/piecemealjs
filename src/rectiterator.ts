import { Iterator } from './iterator';
import { Rect } from './rect';
import { Vec } from './vec';

export class RectIterator implements Iterator<Vec> {
  private _rect: Rect;
  private _x;
  private _y;

  constructor(rect: Rect) {
    this._rect = rect;
    this._x = rect.x - 1;
    this._y = rect.y;
  }

  get current() {
    return new Vec(this._x, this._y);
  }

  moveNext() {
    this._x++;
    if (this._x >= this._rect.right) {
      this._x = this._rect.x;
      this._y++;
    }

    return this._y < this._rect.bottom;
  }
}
