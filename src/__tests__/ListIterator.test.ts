import { ListIterator } from '../ListIterator';

test('Can iterate a list', () => {
  const list = [1, 2, 3, 4, 5, 6];
  const iterator = new ListIterator(list);
  const reconstructed = []
  for (const e of iterator) {
    reconstructed.push(e)
  }
  expect(list).toStrictEqual(reconstructed);
});
