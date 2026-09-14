import type { EntityDefinition } from "./entity.js";

import type { EntitySchema } from "../types/entity.js";

export class EntityRegistry {
  private readonly entities = new Map<
    string,
    EntityDefinition<string, EntitySchema>
  >();

  register<const TName extends string, const TSchema extends EntitySchema>(
    entity: EntityDefinition<TName, TSchema>,
  ): void {
    if (this.entities.has(entity.name)) {
      throw new Error(`Entity "${entity.name}" is already registered.`);
    }

    this.entities.set(
      entity.name,
      entity as EntityDefinition<string, EntitySchema>,
    );
  }

  get(name: string): EntityDefinition<string, EntitySchema> | undefined {
    return this.entities.get(name);
  }

  has(name: string): boolean {
    return this.entities.has(name);
  }

  getAll(): readonly EntityDefinition<string, EntitySchema>[] {
    return Array.from(this.entities.values());
  }

  clear(): void {
    this.entities.clear();
  }

  get size(): number {
    return this.entities.size;
  }
}

export const entityRegistry = new EntityRegistry();
