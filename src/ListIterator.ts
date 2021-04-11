import { Iterator } from './iterator';

export class ListIterator<T> implements Iterator<T> {
  readonly _list: T[];
  index: number;

  constructor(list: T[]) {
    this._list = list;
    this.index = 0;
  }

  current(): T {
    return this._list[this.index];
  }
  moveNext(): boolean {
    this.index++;
    return this.index >= this._list.length;
  }
}
