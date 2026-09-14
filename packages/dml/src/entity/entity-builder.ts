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

import type { EntityDefinition } from "./entity.js";

import type { EntitySchema } from "../types/entity.js";

export class EntityBuilder {
  define<const TName extends string, const TSchema extends EntitySchema>(
    name: TName,
    schema: TSchema,
  ): EntityDefinition<TName, TSchema> {
    return {
      name,
      fields: schema,
    };
  }

  id(options: { prefix?: string } = {}) {
    return new IdProperty(options);
  }

  text() {
    return new TextProperty();
  }

  number() {
    return new NumberProperty();
  }

  float() {
    return new FloatProperty();
  }

  bigNumber() {
    return new BigNumberProperty();
  }

  boolean() {
    return new BooleanProperty();
  }

  dateTime() {
    return new DateTimeProperty();
  }

  json() {
    return new JSONProperty();
  }

  array() {
    return new ArrayProperty();
  }

  enum<const TValues extends readonly unknown[]>(values: TValues) {
    return new EnumProperty(values);
  }
}

export const model = new EntityBuilder();
