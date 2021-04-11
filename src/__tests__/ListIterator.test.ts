import { ListIterator } from '../ListIterator';

test('Can iterate a list', () => {
  const list = [1, 2, 3, 4, 5, 6];
  const iterator = new ListIterator(list);
  expect(iterator.current()).toBe(1);
  expect(iterator.moveNext()).toBe(true);
  expect(iterator.current()).toBe(2);
  expect(iterator.moveNext()).toBe(true);
  expect(iterator.current()).toBe(3);
  expect(iterator.moveNext()).toBe(true);
  expect(iterator.current()).toBe(4);
  expect(iterator.moveNext()).toBe(true);
  expect(iterator.current()).toBe(5);
  expect(iterator.moveNext()).toBe(true);
  expect(iterator.current()).toBe(6);
  expect(iterator.moveNext()).toBe(false);
});
