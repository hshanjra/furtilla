import { Property, type PropertyOptions } from "./property.js";

export class ArrayProperty extends Property<string[], "array", ArrayProperty> {
  constructor(options: PropertyOptions = {}) {
    super("array", options);
  }

  protected clone(options: PropertyOptions): ArrayProperty {
    return new ArrayProperty(options);
  }
}
