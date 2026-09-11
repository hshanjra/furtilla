import { Field } from "./field.js";

export function date() {
  return new Field<Date, "date">("date");
}
