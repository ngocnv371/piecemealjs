import { Iterator } from "./iterator";

export abstract class IterableBase<T> {
    public get iterator(): Iterator<T> {
        throw new Error("Not implemented");
    }
}