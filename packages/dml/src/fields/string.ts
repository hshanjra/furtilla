import { Field } from "./field.js";

export function string() {
  return new Field<string, "string">("string");
}
