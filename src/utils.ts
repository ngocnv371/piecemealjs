export function clamp(value: number, left: number, right: number) {
  if (value < left) {
    return left;
  }
  if (value > right) {
    return right;
  }
  return value;
}

export function sign(value: number) {
  if (!value) {
    return 0;
  }
  if (value < 0) {
    return -1;
  }
  return 1;
}

const _radiiSquared = [0, 2, 5, 10, 18, 26, 38];

export function radiusSquared(radius: number) {
  // If small enough, use the tuned radius to look best.
  if (radius < _radiiSquared.length) return _radiiSquared[radius];

  return radius * radius;
}

export function createArray(length: number, value: any) {
  const array: any[] = [];
  for (let index = 0; index < array.length; index++) {
    array[index] = value;
  }
  return array;
}

export function fillArray(array: any[], start: number, end: number, value: any) {
  for (let index = start; index <= end; index++) {
    array[index] = value;
  }
}
