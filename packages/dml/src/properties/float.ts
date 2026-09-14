import { Property, type PropertyOptions } from "./property.js";

export class FloatProperty extends Property<number, "float", FloatProperty> {
  constructor(options: PropertyOptions = {}) {
    super("float", options);
  }

  protected clone(options: PropertyOptions): FloatProperty {
    return new FloatProperty(options);
  }
}
