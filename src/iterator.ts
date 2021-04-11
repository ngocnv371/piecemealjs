export interface Iterator<T> {
  current(): T;
  moveNext(): boolean;
}
