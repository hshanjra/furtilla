import type { EntityDefinition } from "./entity.js";

import type { EntitySchema } from "../types/entity.js";

import type { RelationMetadata } from "../relations/relation.js";

export interface EntityRelation {
  readonly entity: EntityDefinition<string, EntitySchema>;

  readonly property: string;

  readonly relation: RelationMetadata;

  readonly target: EntityDefinition<string, EntitySchema> | undefined;
}

export class EntityGraph {
  constructor(
    private readonly entities: readonly EntityDefinition<
      string,
      EntitySchema
    >[],
  ) {}

  getRelations(
    entity: EntityDefinition<string, EntitySchema>,
  ): readonly EntityRelation[] {
    const relations: EntityRelation[] = [];

    for (const [property, relation] of Object.entries(
      entity.metadata.relations,
    )) {
      if (!relation) {
        continue;
      }

      let target: EntityDefinition<string, EntitySchema> | undefined;

      try {
        const resolved = relation.target();

        if (
          resolved &&
          typeof resolved === "object" &&
          "__entity" in resolved
        ) {
          target = resolved as EntityDefinition<string, EntitySchema>;
        }
      } catch {
        // Target can be unresolved during
        // partial module initialization.
      }

      relations.push({
        entity,
        property,
        relation,
        target,
      });
    }

    return relations;
  }

  getAllRelations(): readonly EntityRelation[] {
    return this.entities.flatMap((entity) => this.getRelations(entity));
  }
}
