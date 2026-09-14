import type { EntitySchema } from "../types/entity.js";

export interface EntityDefinition<
  TName extends string,
  TSchema extends EntitySchema,
> {
  readonly name: TName;

  readonly tableName: string;

  readonly fields: TSchema;

  readonly __entity: true;
}
