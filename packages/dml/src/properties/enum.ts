import { Property, type PropertyOptions } from "./property.js";

export class EnumProperty<
  const TValues extends readonly unknown[],
> extends Property<TValues[number], "enum", EnumProperty<TValues>> {
  readonly values: TValues;

  constructor(values: TValues, options: PropertyOptions = {}) {
    super("enum", options);

    this.values = values;
  }

  protected clone(options: PropertyOptions): EnumProperty<TValues> {
    return new EnumProperty(this.values, options);
  }
}
