import { Field } from "./field.js";

export function boolean() {
  return new Field<boolean, "boolean">("boolean");
}
