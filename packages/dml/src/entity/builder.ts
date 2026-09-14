import {
  ArrayProperty,
  BigNumberProperty,
  BooleanProperty,
  DateTimeProperty,
  EnumProperty,
  FloatProperty,
  IdProperty,
  JSONProperty,
  NumberProperty,
  TextProperty,
} from "../properties/index.js";
import { buildEntityMetadata } from "../metadata/build.js";

import type { EntitySchema } from "../types/entity.js";

import { normalizeEntityName, normalizeTableName } from "../utils/naming.js";

import type { EntityDefinition } from "./entity.js";

import {
  HasMany,
  HasOne,
  HasOneWithForeignKey,
  BelongsTo,
  ManyToMany,
  type RelationshipOptions,
} from "../relations/index.js";

export class EntityBuilder {
  define<const TName extends string, const TSchema extends EntitySchema>(
    nameOrConfig:
      | TName
      | {
          name?: string;
          tableName?: string;
        },
    schema: TSchema,
  ): EntityDefinition<ReturnType<typeof normalizeEntityName> & TName, TSchema> {
    const rawName =
      typeof nameOrConfig === "string"
        ? nameOrConfig
        : (nameOrConfig.name ?? nameOrConfig.tableName);

    if (!rawName) {
      throw new Error("Entity name is required.");
    }

    const name = normalizeEntityName(rawName);

    const tableName =
      typeof nameOrConfig === "object" && nameOrConfig.tableName
        ? normalizeTableName(nameOrConfig.tableName)
        : normalizeTableName(rawName);

    const metadata = buildEntityMetadata(name, tableName, schema);

    return {
      name,
      tableName,
      fields: schema,
      metadata,
      __entity: true,
    } as EntityDefinition<TName, TSchema>;
  }
  id(options?: { prefix?: string }): IdProperty {
    return new IdProperty(options);
  }

  text(): TextProperty {
    return new TextProperty();
  }

  number(): NumberProperty {
    return new NumberProperty();
  }

  float(): FloatProperty {
    return new FloatProperty();
  }

  bigNumber(): BigNumberProperty {
    return new BigNumberProperty();
  }

  boolean(): BooleanProperty {
    return new BooleanProperty();
  }

  dateTime(): DateTimeProperty {
    return new DateTimeProperty();
  }

  json(): JSONProperty {
    return new JSONProperty();
  }

  array(): ArrayProperty {
    return new ArrayProperty();
  }

  enum<const TValues extends readonly unknown[]>(
    values: TValues,
  ): EnumProperty<TValues> {
    return new EnumProperty(values);
  }

  hasOne<TTarget, const TForeignKeyName extends string | undefined = undefined>(
    entityBuilder: () => TTarget,
    options: RelationshipOptions & {
      foreignKey: true;
      foreignKeyName?: TForeignKeyName;
    },
  ): HasOneWithForeignKey<TTarget, TForeignKeyName>;

  hasOne<TTarget>(
    entityBuilder: () => TTarget,
    options?: RelationshipOptions & {
      foreignKey?: false;
    },
  ): HasOne<TTarget>;

  hasOne<TTarget>(
    entityBuilder: () => TTarget,
    options: RelationshipOptions = {},
  ): HasOne<TTarget> {
    return new HasOne(entityBuilder, options);
  }

  belongsTo<
    TTarget,
    const TForeignKeyName extends string | undefined = undefined,
  >(
    entityBuilder: () => TTarget,
    options: RelationshipOptions = {},
  ): BelongsTo<TTarget, TForeignKeyName> {
    return new BelongsTo(entityBuilder, options);
  }

  hasMany<TTarget>(
    entityBuilder: () => TTarget,
    options: RelationshipOptions = {},
  ): HasMany<TTarget> {
    return new HasMany(entityBuilder, options);
  }

  manyToMany<TTarget>(
    entityBuilder: () => TTarget,
    options: import("../relations/many-to-many.js").ManyToManyOptions = {},
  ): ManyToMany<TTarget> {
    return new ManyToMany(entityBuilder, options);
  }
}

export const model = new EntityBuilder();
