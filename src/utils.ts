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
