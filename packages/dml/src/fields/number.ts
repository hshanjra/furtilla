import { Field } from "./field.js";

export function number() {
  return new Field<number, "number">("number");
}
