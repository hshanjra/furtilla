import { Property, type PropertyOptions } from "./property.js";

export class BooleanProperty extends Property<
  boolean,
  "boolean",
  BooleanProperty
> {
  constructor(options: PropertyOptions = {}) {
    super("boolean", options);
  }

  protected clone(options: PropertyOptions): BooleanProperty {
    return new BooleanProperty(options);
  }
}
