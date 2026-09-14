import { Property, type PropertyOptions } from "./property.js";

export class ArrayProperty<T = string> extends Property<
  T[],
  "array",
  ArrayProperty<T>
> {
  constructor(options: PropertyOptions = {}) {
    super("array", options);
  }

  protected clone(options: PropertyOptions): ArrayProperty<T> {
    return new ArrayProperty<T>(options);
  }
}
