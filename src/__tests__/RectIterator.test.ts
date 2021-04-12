import { Rect } from '../Rect';
import { Vec } from '../vec';

test('can iterate 3x2', () => {
  const rect = new Rect(0, 0, 3, 2);
  const cells: Vec[] = [];
  for (const pos of rect) {
    cells.push(pos);
  }
  expect(cells.length).toBe(6);
  expect(cells[0].toString()).toBe(new Vec(0, 0).toString());
  expect(cells[1].toString()).toBe(new Vec(1, 0).toString());
  expect(cells[2].toString()).toBe(new Vec(2, 0).toString());
  expect(cells[3].toString()).toBe(new Vec(0, 1).toString());
  expect(cells[4].toString()).toBe(new Vec(1, 1).toString());
  expect(cells[5].toString()).toBe(new Vec(2, 1).toString());
});

test('can iterate 2x3', () => {
  const rect = new Rect(0, 0, 2, 3);
  const cells: Vec[] = [];
  for (const pos of rect) {
    cells.push(pos);
  }
  expect(cells.length).toBe(6);
  expect(cells[0].toString()).toBe(new Vec(0, 0).toString());
  expect(cells[1].toString()).toBe(new Vec(1, 0).toString());
  expect(cells[2].toString()).toBe(new Vec(0, 1).toString());
  expect(cells[3].toString()).toBe(new Vec(1, 1).toString());
  expect(cells[4].toString()).toBe(new Vec(0, 2).toString());
  expect(cells[5].toString()).toBe(new Vec(1, 2).toString());
});
