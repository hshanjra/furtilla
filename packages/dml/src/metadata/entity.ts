import type { EntitySchema } from "../types/entity.js";
import type { PropertyMetadata } from "./property.js";
import type { RelationMetadata } from "../relations/relation.js";

export interface EntityMetadata<TSchema extends EntitySchema = EntitySchema> {
  readonly name: string;
  readonly tableName: string;

  readonly properties: {
    readonly [K in keyof TSchema]?: PropertyMetadata;
  };

  readonly relations: {
    readonly [K in keyof TSchema]?: RelationMetadata;
  };

  readonly systemFields: {
    readonly createdAt: true;
    readonly updatedAt: true;
    readonly deletedAt: true;
  };
}
