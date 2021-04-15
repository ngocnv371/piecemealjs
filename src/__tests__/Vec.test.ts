import { Direction } from '../Direction';
import { Vec } from '../vec';

test('zero', () => {
  expect(Vec.zero.x).toEqual(0);
  expect(Vec.zero.y).toEqual(0);
});

test('coordinates', () => {
  const vec = new Vec(2, 3);
  expect(vec.x).toEqual(2);
  expect(vec.y).toEqual(3);
});

test('area', () => {
  expect(new Vec(0, 0).area).toEqual(0);
  expect(new Vec(2, 3).area).toEqual(6);
  expect(new Vec(-4, 5).area).toEqual(-20);
});

test('kingLength', () => {
  expect(new Vec(0, 0).kingLength).toEqual(0);
  expect(new Vec(2, 3).kingLength).toEqual(3);
  expect(new Vec(-4, 5).kingLength).toEqual(5);
});

test('rookLength', () => {
  expect(new Vec(0, 0).rookLength).toEqual(0);
  expect(new Vec(2, 3).rookLength).toEqual(5);
  expect(new Vec(-4, 5).rookLength).toEqual(9);
});

test('lengthSquared', () => {
  expect(new Vec(0, 0).lengthSquared).toEqual(0);
  expect(new Vec(2, 3).lengthSquared).toEqual(13);
  expect(new Vec(-4, 5).lengthSquared).toEqual(41);
});

test('length', () => {
  expect(new Vec(0, 0).length).toEqual(0.0);
  expect(new Vec(3, 4).length).toEqual(5);
  expect(new Vec(1, 2).length).toEqual(Math.sqrt(5));
});

test('nearestDirection', () => {
  expect(Vec.zero.nearestDirection).toEqual(Direction.none);

  // Unit distance.
  expect(new Vec(0, -1).nearestDirection).toEqual(Direction.n);
  expect(new Vec(1, -1).nearestDirection).toEqual(Direction.ne);
  expect(new Vec(1, 0).nearestDirection).toEqual(Direction.e);
  expect(new Vec(1, 1).nearestDirection).toEqual(Direction.se);
  expect(new Vec(0, 1).nearestDirection).toEqual(Direction.s);
  expect(new Vec(-1, 1).nearestDirection).toEqual(Direction.sw);
  expect(new Vec(-1, 0).nearestDirection).toEqual(Direction.w);

  // Farther.
  expect(new Vec(0, -4).nearestDirection).toEqual(Direction.n);
  expect(new Vec(4, -4).nearestDirection).toEqual(Direction.ne);
  expect(new Vec(4, 0).nearestDirection).toEqual(Direction.e);
  expect(new Vec(4, 4).nearestDirection).toEqual(Direction.se);
  expect(new Vec(0, 4).nearestDirection).toEqual(Direction.s);
  expect(new Vec(-4, 4).nearestDirection).toEqual(Direction.sw);
  expect(new Vec(-4, 0).nearestDirection).toEqual(Direction.w);

  // If not directly along line, goes to nearest. Tie-breaker goes clockwise.
  expect(new Vec(2, -5).nearestDirection).toEqual(Direction.n);
  expect(new Vec(2, -4).nearestDirection).toEqual(Direction.ne);
  expect(new Vec(2, -3).nearestDirection).toEqual(Direction.ne);

  expect(new Vec(3, -2).nearestDirection).toEqual(Direction.ne);
  expect(new Vec(4, -2).nearestDirection).toEqual(Direction.e);
  expect(new Vec(5, -2).nearestDirection).toEqual(Direction.e);

  expect(new Vec(5, 2).nearestDirection).toEqual(Direction.e);
  expect(new Vec(4, 2).nearestDirection).toEqual(Direction.se);
  expect(new Vec(3, 2).nearestDirection).toEqual(Direction.se);

  expect(new Vec(2, 3).nearestDirection).toEqual(Direction.se);
  expect(new Vec(2, 4).nearestDirection).toEqual(Direction.s);
  expect(new Vec(2, 5).nearestDirection).toEqual(Direction.s);

  expect(new Vec(-2, 5).nearestDirection).toEqual(Direction.s);
  expect(new Vec(-2, 4).nearestDirection).toEqual(Direction.sw);
  expect(new Vec(-2, 3).nearestDirection).toEqual(Direction.sw);

  expect(new Vec(-3, 2).nearestDirection).toEqual(Direction.sw);
  expect(new Vec(-4, 2).nearestDirection).toEqual(Direction.w);
  expect(new Vec(-5, 2).nearestDirection).toEqual(Direction.w);

  expect(new Vec(-5, -2).nearestDirection).toEqual(Direction.w);
  expect(new Vec(-4, -2).nearestDirection).toEqual(Direction.nw);
  expect(new Vec(-3, -2).nearestDirection).toEqual(Direction.nw);

  expect(new Vec(-2, -3).nearestDirection).toEqual(Direction.nw);
  expect(new Vec(-2, -4).nearestDirection).toEqual(Direction.n);
  expect(new Vec(-2, -5).nearestDirection).toEqual(Direction.n);
});

test('neighbors', () => {
  expect(new Vec(3, 4).neighbors).toEqual([
    new Vec(3, 3),
    new Vec(4, 3),
    new Vec(4, 4),
    new Vec(4, 5),
    new Vec(3, 5),
    new Vec(2, 5),
    new Vec(2, 4),
    new Vec(2, 3),
  ]);
});

test('cardinalNeighbors', () => {
  expect(new Vec(3, 4).cardinalNeighbors).toEqual([new Vec(3, 3), new Vec(4, 4), new Vec(3, 5), new Vec(2, 4)]);
});

test('intercardinalNeighbors', () => {
  expect(new Vec(3, 4).intercardinalNeighbors).toEqual([new Vec(4, 3), new Vec(4, 5), new Vec(2, 5), new Vec(2, 3)]);
});

test('*', () => {
  expect(new Vec(2, 3).multiply(-1).toString()).toEqual(new Vec(-2, -3).toString());
  expect(new Vec(2, 3).multiply(4).toString()).toEqual(new Vec(8, 12).toString());
});

test('/', () => {
  expect(new Vec(2, 5).divide(2).toString()).toEqual(new Vec(1, 2).toString());
  expect(new Vec(2, 5).divide(4).toString()).toEqual(new Vec(0, 1).toString());
});

describe('+', () => {
  test('Vec sums the vectors', () => {
    expect(new Vec(2, 3).add(new Vec(1, 1)).toString()).toEqual(new Vec(3, 4).toString());
    expect(new Vec(2, 3).add(new Vec(-1, 3)).toString()).toEqual(new Vec(1, 6).toString());
  });

  test('Direction sums the vectors', () => {
    expect(new Vec(2, 3).add(Direction.se).toString()).toEqual(new Vec(3, 4).toString());
    expect(new Vec(2, 3).add(Direction.nw).toString()).toEqual(new Vec(1, 2).toString());
  });

  test('int offsets both coordinates', () => {
    expect(new Vec(2, 3).add(1).toString()).toEqual(new Vec(3, 4).toString());
    expect(new Vec(2, 3).add(2).toString()).toEqual(new Vec(4, 5).toString());
  });
});

describe('-', () => {
  test('Vec subtracts the vectors', () => {
    expect(new Vec(2, 3).subtract(new Vec(1, 1)).toString()).toEqual(new Vec(1, 2).toString());
    expect(new Vec(2, 3).subtract(new Vec(-1, 3)).toString()).toEqual(new Vec(3, 0).toString());
  });

  test('Direction subtracts the vectors', () => {
    expect(new Vec(2, 3).subtract(Direction.se).toString()).toEqual(new Vec(1, 2).toString());
    expect(new Vec(2, 3).subtract(Direction.nw).toString()).toEqual(new Vec(3, 4).toString());
  });

  test('int offsets both coordinates', () => {
    expect(new Vec(2, 3).subtract(1).toString()).toEqual(new Vec(1, 2).toString());
    expect(new Vec(2, 3).subtract(2).toString()).toEqual(new Vec(0, 1).toString());
  });
});

describe('<', () => {
  test('Vec compares magnitude', () => {
    expect(new Vec(3, 4).isLessThan(new Vec(-2, 2))).toBe(false);
    expect(new Vec(3, 4).isLessThan(new Vec(4, 3))).toBe(false);
    expect(new Vec(3, 4).isLessThan(new Vec(5, 6))).toBe(true);
  });

  test('Direction compares magnitude', () => {
    expect(new Vec(3, 4).isLessThan(Direction.se)).toBe(false);
    expect(new Vec(1, 1).isLessThan(Direction.se)).toBe(false);
    expect(new Vec(0, 1).isLessThan(Direction.se)).toBe(true);
  });

  test('num compares magnitude to value', () => {
    expect(new Vec(3, 4).isLessThan(4)).toBe(false);
    expect(new Vec(3, 4).isLessThan(5.0)).toBe(false);
    expect(new Vec(3, 4).isLessThan(10)).toBe(true);
  });
});

describe('>', () => {
  test('Vec compares magnitude', () => {
    expect(new Vec(3, 4).isGreaterThan(new Vec(-2, 2))).toBe(true);
    expect(new Vec(3, 4).isGreaterThan(new Vec(4, 3))).toBe(false);
    expect(new Vec(3, 4).isGreaterThan(new Vec(5, 6))).toBe(false);
  });

  test('Direction compares magnitude', () => {
    expect(new Vec(3, 4).isGreaterThan(Direction.se)).toBe(true);
    expect(new Vec(1, 1).isGreaterThan(Direction.se)).toBe(false);
    expect(new Vec(0, 1).isGreaterThan(Direction.se)).toBe(false);
  });

  test('num compares magnitude to value', () => {
    expect(new Vec(3, 4).isGreaterThan(4)).toBe(true);
    expect(new Vec(3, 4).isGreaterThan(5.0)).toBe(false);
    expect(new Vec(3, 4).isGreaterThan(10)).toBe(false);
  });
});

describe('<=', () => {
  test('Vec compares magnitude', () => {
    expect(new Vec(3, 4).isLessThanOrEqual(new Vec(-2, 2))).toBe(false);
    expect(new Vec(3, 4).isLessThanOrEqual(new Vec(4, 3))).toBe(true);
    expect(new Vec(3, 4).isLessThanOrEqual(new Vec(5, 6))).toBe(true);
  });

  test('Direction compares magnitude', () => {
    expect(new Vec(3, 4).isLessThanOrEqual(Direction.se)).toBe(false);
    expect(new Vec(1, 1).isLessThanOrEqual(Direction.se)).toBe(true);
    expect(new Vec(0, 1).isLessThanOrEqual(Direction.se)).toBe(true);
  });

  test('num compares magnitude to value', () => {
    expect(new Vec(3, 4).isLessThanOrEqual(4)).toBe(false);
    expect(new Vec(3, 4).isLessThanOrEqual(5.0)).toBe(true);
    expect(new Vec(3, 4).isLessThanOrEqual(10)).toBe(true);
  });
});

describe('>=', () => {
  test('Vec compares magnitude', () => {
    expect(new Vec(3, 4).isGreaterThanOrEqual(new Vec(-2, 2))).toBe(true);
    expect(new Vec(3, 4).isGreaterThanOrEqual(new Vec(4, 3))).toBe(true);
    expect(new Vec(3, 4).isGreaterThanOrEqual(new Vec(5, 6))).toBe(false);
  });

  test('Direction compares magnitude', () => {
    expect(new Vec(3, 4).isGreaterThanOrEqual(Direction.se)).toBe(true);
    expect(new Vec(1, 1).isGreaterThanOrEqual(Direction.se)).toBe(true);
    expect(new Vec(0, 1).isGreaterThanOrEqual(Direction.se)).toBe(false);
  });

  test('num compares magnitude to value', () => {
    expect(new Vec(3, 4).isGreaterThanOrEqual(4)).toBe(true);
    expect(new Vec(3, 4).isGreaterThanOrEqual(5.0)).toBe(true);
    expect(new Vec(3, 4).isGreaterThanOrEqual(10)).toBe(false);
  });
});

test('abs()', () => {
  expect(new Vec(2, -1).abs()).toEqual(new Vec(2, 1));
  expect(new Vec(0, -3).abs()).toEqual(new Vec(0, 3));
});

test('contains()', () => {
  expect(new Vec(3, 4).contains(new Vec(0, 0))).toBe(true);
  expect(new Vec(3, 4).contains(new Vec(2, 1))).toBe(true);
  expect(new Vec(3, 4).contains(new Vec(-1, 0))).toBe(false);
  expect(new Vec(3, 4).contains(new Vec(0, -1))).toBe(false);
  expect(new Vec(3, 4).contains(new Vec(3, 1))).toBe(false);
  expect(new Vec(3, 4).contains(new Vec(2, 4))).toBe(false);

  expect(new Vec(-3, 4).contains(new Vec(-3, 0))).toBe(true);
  expect(new Vec(-3, 4).contains(new Vec(-2, 1))).toBe(true);
  expect(new Vec(-3, 4).contains(new Vec(-4, 0))).toBe(false);
  expect(new Vec(-3, 4).contains(new Vec(0, -1))).toBe(false);
  expect(new Vec(-3, 4).contains(new Vec(0, 1))).toBe(false);
  expect(new Vec(-3, 4).contains(new Vec(-2, 4))).toBe(false);
});

test('offset()', () => {
  expect(new Vec(1, 2).offset(3, 4)).toEqual(new Vec(4, 6));
  expect(new Vec(1, 2).offset(1, -2)).toEqual(new Vec(2, 0));
});

test('offsetX()', () => {
  expect(new Vec(1, 2).offsetX(3)).toEqual(new Vec(4, 2));
  expect(new Vec(1, 2).offsetX(-2)).toEqual(new Vec(-1, 2));
});

test('offsetY()', () => {
  expect(new Vec(1, 2).offsetY(3)).toEqual(new Vec(1, 5));
  expect(new Vec(1, 2).offsetY(-1)).toEqual(new Vec(1, 1));
});

test('toString()', () => {
  expect(new Vec(1, 2).toString()).toEqual('1, 2');
  expect(new Vec(-3, 0).toString()).toEqual('-3, 0');
});

test('equality', () => {
  expect(new Vec(2, 1).isEqual(new Vec(2, 1))).toBe(true);
  expect(new Vec(2, 1).isEqual(new Vec(1, 2))).toBe(false);

  expect(new Vec(1, 1).isEqual(Direction.se)).toBe(true);
  expect(new Vec(2, 1).isEqual(Direction.se)).toBe(false);
});

test('rotateLeft45', () => {
  expect(Vec.s.rotateLeft45).toBe(Vec.se);
  expect(new Vec(Vec.s.x, Vec.s.y).rotateLeft45.toString()).toBe(new Vec(Vec.se.x, Vec.se.y).toString());
})