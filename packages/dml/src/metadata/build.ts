import type { EntitySchema } from "../types/entity.js";

import type { Property } from "../properties/property.js";

import type { PropertyMetadata } from "./property.js";

import type { EntityMetadata } from "./entity.js";
import type { RelationMetadata } from "../relations/relation.js";

function getPropertyMetadata(
  property: Property<any, any, any>,
): PropertyMetadata {
  const options = property.options;

  const metadata: PropertyMetadata = {
    kind: property.kind,

    nullable: options.nullable ?? false,
    unique: options.unique ?? false,
    primaryKey: options.primaryKey ?? false,
    generated: options.generated ?? false,

    hasDefault: options.default !== undefined,

    ...(options.default !== undefined
      ? {
          defaultValue: options.default,
        }
      : {}),
  };

  if ("prefix" in property) {
    const prefix = (
      property as {
        prefix?: string;
      }
    ).prefix;

    if (prefix !== undefined) {
      return {
        ...metadata,
        prefix,
      };
    }
  }

  if ("values" in property) {
    const values = (
      property as {
        values?: readonly unknown[];
      }
    ).values;

    if (values !== undefined) {
      return {
        ...metadata,
        enumValues: values,
      };
    }
  }

  return metadata;
}

export function buildEntityMetadata<TSchema extends EntitySchema>(
  name: string,
  tableName: string,
  schema: TSchema,
): EntityMetadata<TSchema> {
  const properties = {} as {
    [K in keyof TSchema]?: PropertyMetadata;
  };

  const relations = {} as {
    [K in keyof TSchema]?: RelationMetadata;
  };

  for (const key of Object.keys(schema) as Array<keyof TSchema>) {
    const field = schema[key];

    if (!field) {
      continue;
    }

    if ("__relation" in field) {
      relations[key] = field.metadata;
      continue;
    }

    properties[key] = getPropertyMetadata(field);
  }

  return {
    name,
    tableName,
    properties,
    relations,

    systemFields: {
      createdAt: true,
      updatedAt: true,
      deletedAt: true,
    },
  };
}
