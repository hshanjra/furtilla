import type { EntityMetadata } from "../metadata/entity.js";
import type { EntitySchema, InferEntity } from "../types/index.js";

export interface EntityDefinition<
  TName extends string = string,
  TSchema extends EntitySchema = EntitySchema,
> {
  readonly name: TName;
  readonly tableName: string;

  readonly fields: TSchema;

  readonly metadata: EntityMetadata<TSchema>;

  readonly __entity: true;

  readonly __type?: InferEntity<TSchema>;
}
