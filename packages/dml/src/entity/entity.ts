import type { InferEntity, EntitySchema } from "../types/entity.js";

import type { InferCreateInput, InferUpdateInput } from "../types/input.js";

export interface EntityDefinition<
  TName extends string,
  TSchema extends EntitySchema,
> {
  readonly name: TName;
  readonly fields: TSchema;

  readonly __entity?: true;

  readonly __types?: {
    entity: InferEntity<TSchema>;
    create: InferCreateInput<TSchema>;
    update: InferUpdateInput<TSchema>;
  };
}
