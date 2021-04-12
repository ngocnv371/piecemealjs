import { Vec } from './vec';

export class Line {
  public readonly start: Vec;
  public readonly end: Vec;

  constructor(start: Vec, end: Vec) {
    this.start = start;
    this.end = end;
  }
}
