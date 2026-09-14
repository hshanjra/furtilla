import { Property, type PropertyOptions } from "./property.js";

export class DateTimeProperty extends Property<
  Date,
  "date_time",
  DateTimeProperty
> {
  constructor(options: PropertyOptions = {}) {
    super("date_time", options);
  }

  protected clone(options: PropertyOptions): DateTimeProperty {
    return new DateTimeProperty(options);
  }
}
