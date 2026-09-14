import { Property, type PropertyOptions } from "./property.js";

export class TextProperty extends Property<string, "text", TextProperty> {
  constructor(options: PropertyOptions = {}) {
    super("text", options);
  }

  protected clone(options: PropertyOptions): TextProperty {
    return new TextProperty(options);
  }
}
