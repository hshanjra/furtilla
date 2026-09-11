import type { FieldDefinition } from "../fields/base.js";
import type { ModelDefinition } from "./model.js";
import { created_at, deleted_at, updated_at } from "./system-fields.js";

export function define<
  const TName extends string,
  const TFields extends Record<string, FieldDefinition<unknown>>,
>(name: TName, fields: TFields): ModelDefinition<TName, TFields> {
  return {
    name,

    fields: {
      ...fields,
      created_at: created_at,
      updated_at: updated_at,
      deleted_at: deleted_at,
    },
  };
}
