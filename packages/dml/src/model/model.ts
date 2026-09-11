import type { FieldDefinition } from "../fields/base.js";

export type ModelFields = Record<string, FieldDefinition<unknown>>;

export interface ModelDefinition<
  TName extends string,
  TFields extends ModelFields,
> {
  readonly name: TName;
  readonly fields: TFields;

  readonly __model?: true;
}
