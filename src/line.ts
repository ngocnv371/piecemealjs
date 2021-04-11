import { IterableBase } from './IterableBase';
import { Iterator } from './iterator';
import { LineIterator } from './LineIterator';
import { Vec } from './vec';

export class Line extends IterableBase<Vec> {
  public readonly start: Vec;
  public readonly end: Vec;

  constructor(start: Vec, end: Vec) {
    super();
    this.start = start;
    this.end = end;
  }

  public get iterator(): Iterator<Vec> {
    return new LineIterator(this.start, this.end);
  }
}
