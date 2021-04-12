import { Rect } from '../RectV';
import { Vec } from '../Vec';

test('empty', () => {
  expect(Rect.empty.x).toBe(0);
  expect(Rect.empty.y).toBe(0);
  expect(Rect.empty.width).toBe(0);
  expect(Rect.empty.height).toBe(0);
});

test('Rect.posAndSize()', () => {
  const rect = Rect.posAndSize(new Vec(1, 2), new Vec(3, 4));
  expect(rect.x).toBe(1);
  expect(rect.y).toBe(2);
  expect(rect.width).toBe(3);
  expect(rect.height).toBe(4);
});

test('Rect.leftTopRightBottom()', () => {
  const rect = Rect.leftTopRightBottom(1, 2, 3, 4);
  expect(rect.x).toBe(1);
  expect(rect.y).toBe(2);
  expect(rect.width).toBe(2);
  expect(rect.height).toBe(2);
});

test('Rect.row()', () => {
  const rect = Rect.row(1, 2, 3);
  expect(rect.x).toBe(1);
  expect(rect.y).toBe(2);
  expect(rect.width).toBe(3);
  expect(rect.height).toBe(1);
});

test('Rect.column()', () => {
  const rect = Rect.column(1, 2, 3);
  expect(rect.x).toBe(1);
  expect(rect.y).toBe(2);
  expect(rect.width).toBe(1);
  expect(rect.height).toBe(3);
});

test('coordinates', () => {
  const rect = new Rect(-1, 2, 3, 4);
  expect(rect.pos).toStrictEqual(new Vec(-1, 2));
  expect(rect.size).toStrictEqual(new Vec(3, 4));
  expect(rect.x).toBe(-1);
  expect(rect.y).toBe(2);
  expect(rect.width).toBe(3);
  expect(rect.height).toBe(4);

  expect(rect.left).toBe(-1);
  expect(rect.top).toBe(2);
  expect(rect.right).toBe(2);
  expect(rect.bottom).toBe(6);

  expect(rect.topLeft).toStrictEqual(new Vec(-1, 2));
  expect(rect.topRight).toStrictEqual(new Vec(2, 2));
  expect(rect.bottomRight).toStrictEqual(new Vec(2, 6));
  expect(rect.bottomLeft).toStrictEqual(new Vec(-1, 6));
});

test('negative size coordinates', () => {
  const rect = new Rect(1, 2, -3, -4);
  expect(rect.pos).toStrictEqual(new Vec(1, 2));
  expect(rect.size).toStrictEqual(new Vec(-3, -4));
  expect(rect.x).toBe(1);
  expect(rect.y).toBe(2);
  expect(rect.width).toBe(-3);
  expect(rect.height).toBe(-4);

  expect(rect.left).toBe(-2);
  expect(rect.top).toBe(-2);
  expect(rect.right).toBe(1);
  expect(rect.bottom).toBe(2);

  expect(rect.topLeft).toStrictEqual(new Vec(-2, -2));
  expect(rect.topRight).toStrictEqual(new Vec(1, -2));
  expect(rect.bottomRight).toStrictEqual(new Vec(1, 2));
  expect(rect.bottomLeft).toStrictEqual(new Vec(-2, 2));
});

// TODO: center.

test('area', () => {
  expect(new Rect(-1, 2, 3, 4).area).toBe(12);
  expect(new Rect(0, 0, 1, 4).area).toBe(4);
  expect(new Rect(0, 0, 3, 1).area).toBe(3);
  expect(new Rect(0, 0, 3, 0).area).toBe(0);

  // Can have negative area.
  expect(new Rect(0, 0, -2, 3).area).toBe(-6);
  expect(new Rect(0, 0, 2, -3).area).toBe(-6);
  expect(new Rect(0, 0, -2, -3).area).toBe(6);
});

test('toString()', () => {
  expect(new Rect(1, 2, 3, 4).toString()).toBe('(1, 2)-(3, 4)');
});

// TODO: inflate().

test('offset()', () => {
  const rect = new Rect(1, 2, 3, 4);

  expect(rect.offset(5, 6)).toStrictEqual(new Rect(6, 8, 3, 4));

  expect(rect.offset(-5, -6)).toStrictEqual(new Rect(-4, -4, 3, 4));
});

// TODO: contains().
// TODO: containsRect().

test('clamp()', () => {
  const rect = new Rect(1, 2, 3, 4);

  // Inside.
  expect(rect.clamp(new Vec(2, 3))).toStrictEqual(new Vec(2, 3));

  // Left.
  expect(rect.clamp(new Vec(0, 3))).toStrictEqual(new Vec(1, 3));

  // Right.
  expect(rect.clamp(new Vec(10, 3))).toStrictEqual(new Vec(4, 3));

  // Top.
  expect(rect.clamp(new Vec(2, 0))).toStrictEqual(new Vec(2, 2));

  // Bottom.
  expect(rect.clamp(new Vec(2, 8))).toStrictEqual(new Vec(2, 6));

  // Corner.
  expect(rect.clamp(new Vec(20, 30))).toStrictEqual(new Vec(4, 6));
});
