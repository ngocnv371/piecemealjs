import { VecBase } from './vecbase';

export class Direction extends VecBase {
  public static readonly none = new Direction(0, 0);
  public static readonly n = new Direction(0, -1);
  public static readonly ne = new Direction(1, -1);
  public static readonly e = new Direction(1, 0);
  public static readonly se = new Direction(1, 1);
  public static readonly s = new Direction(0, 1);
  public static readonly sw = new Direction(-1, 1);
  public static readonly w = new Direction(-1, 0);
  public static readonly nw = new Direction(-1, -1);
  /// The eight cardinal and intercardinal directions.
  public static readonly all = [
    Direction.n,
    Direction.ne,
    Direction.e,
    Direction.se,
    Direction.s,
    Direction.sw,
    Direction.w,
    Direction.nw,
  ];
  /// The four cardinal directions: north, south, east, and west.
  public static readonly cardinal = [Direction.n, Direction.e, Direction.s, Direction.w];
  /// The four directions between the cardinal ones: northwest, northeast,
  /// southwest and southeast.
  public static readonly intercardinal = [Direction.ne, Direction.se, Direction.sw, Direction.nw];

  constructor(x: number, y: number) {
    super(x, y);
  }
}
