export abstract class Iterator<T> {
  public get current(): T {
    throw new Error('Not implemented');
  }
  public moveNext(): boolean {
    throw new Error('Not implemented');
  }
}
