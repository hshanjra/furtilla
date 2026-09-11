import { Field } from "../fields/field.js";

export const created_at = new Field<Date, "date">("date");

export const updated_at = new Field<Date, "date">("date");

export const deleted_at = new Field<Date | null, "date">("date", {
  nullable: true,
});
