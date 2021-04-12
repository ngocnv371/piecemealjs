export class ListIterator<T> implements IterableIterator<T> {
  private readonly _list: T[];
  private index: number;

  constructor(list: T[]) {
    this._list = list;
    this.index = 0;
  }

  [Symbol.iterator](): IterableIterator<T> {
    return this;
  }

  next(): IteratorResult<T> {
    if (this.index < this._list.length) {
      return {
        done: false,
        value: this._list[this.index++],
      };
    } else {
      return {
        done: true,
        value: null,
      };
    }
  }
}
