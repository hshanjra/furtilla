import { Property, type PropertyOptions } from "./property.js";

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | {
      [key: string]: JsonValue;
    };

export class JSONProperty extends Property<
  Record<string, JsonValue>,
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
