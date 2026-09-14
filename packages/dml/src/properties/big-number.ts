import { Property, type PropertyOptions } from "./property.js";

export type BigNumberValue = string;

export class BigNumberProperty extends Property<
  BigNumberValue,
  "big_number",
  BigNumberProperty
> {
  constructor(options: PropertyOptions = {}) {
    super("big_number", options);
  }

  protected clone(options: PropertyOptions): BigNumberProperty {
    return new BigNumberProperty(options);
  }
}
