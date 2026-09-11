import { Field } from "./field.js";

export function id() {
  return new Field<string, "id">("id");
}
