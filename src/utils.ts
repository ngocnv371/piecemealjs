export function clamp(value: number, left: number, right: number) {
  if (value < left) {
    return left;
  }
  if (value > right) {
    return right;
  }
  return value;
}
