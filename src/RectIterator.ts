import { Rect } from './Rect';
import { Vec } from './vec';

export class RectIterator implements IterableIterator<Vec> {
  private _rect: Rect;
  private _x;
  private _y;

  constructor(rect: Rect) {
    this._rect = rect;
    this._x = rect.x - 1;
    this._y = rect.y;
  }

  [Symbol.iterator](): IterableIterator<Vec> {
    return this;
  }

  next(): IteratorResult<Vec> {
    if (this._y < this._rect.bottom) {
      this._x++;
      if (this._x >= this._rect.right) {
        this._x = this._rect.x;
        this._y++;
      }
      if (this._y >= this._rect.bottom) {
        return {
          done: true,
          value: null,
        };
      }
      return {
        done: false,
        value: new Vec(this._x, this._y),
      };
    } else {
      return {
        done: true,
        value: null,
      };
    }
  }
}
