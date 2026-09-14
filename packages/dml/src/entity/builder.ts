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

import type { EntitySchema } from "../types/entity.js";

import type { SnakeToCamel } from "../types/naming.js";

import { snakeToCamel } from "../utils/naming.js";

import type { EntityDefinition } from "./entity.js";

import type { EntityNameOrConfig } from "./config.js";

export class EntityBuilder {
  define<
    const TNameOrConfig extends EntityNameOrConfig,
    const TSchema extends EntitySchema,
  >(
    nameOrConfig: TNameOrConfig,
    schema: TSchema,
  ): EntityDefinition<
    TNameOrConfig extends string
      ? SnakeToCamel<TNameOrConfig>
      : TNameOrConfig extends {
            name: infer TName extends string;
          }
        ? TName
        : string,
    TSchema
  > {
    const config =
      typeof nameOrConfig === "string"
        ? {
            name: snakeToCamel(nameOrConfig),
            tableName: nameOrConfig,
          }
        : {
            name: nameOrConfig.name ?? snakeToCamel(nameOrConfig.tableName),
            tableName: nameOrConfig.tableName,
          };

    return {
      name: config.name,
      tableName: config.tableName,
      fields: schema,
      __entity: true as const,
    } as EntityDefinition<
      TNameOrConfig extends string
        ? SnakeToCamel<TNameOrConfig>
        : TNameOrConfig extends {
              name: infer TName extends string;
            }
          ? TName
          : string,
      TSchema
    >;
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
}

export const model = new EntityBuilder();
