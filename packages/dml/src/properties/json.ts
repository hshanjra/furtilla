import { Property, type PropertyOptions } from "./property.js";

export class JSONProperty extends Property<
  Record<string, unknown>,
  "json",
  JSONProperty
> {
  constructor(options: PropertyOptions = {}) {
    super("json", options);
  }

  protected clone(options: PropertyOptions): JSONProperty {
    return new JSONProperty(options);
  }
}
