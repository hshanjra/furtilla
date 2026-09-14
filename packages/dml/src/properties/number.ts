import { Property, type PropertyOptions } from "./property.js";

export class NumberProperty extends Property<number, "number", NumberProperty> {
  constructor(options: PropertyOptions = {}) {
    super("number", options);
  }

  protected clone(options: PropertyOptions): NumberProperty {
    return new NumberProperty(options);
  }
}
