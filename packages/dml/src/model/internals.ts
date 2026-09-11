import type { FieldDefinition } from "../fields/base.js";
import type { ModelDefinition } from "./model.js";

export type ModelOutput<
  TModel extends ModelDefinition<
    string,
    Record<string, FieldDefinition<unknown>>
  >,
> = {
  [K in keyof TModel["fields"]]: TModel["fields"][K] extends FieldDefinition<
    infer T
  >
    ? T
    : never;
};
