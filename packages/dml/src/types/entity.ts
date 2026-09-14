import type { Property } from "../properties/property.js";

import type { PropertyType, IsNullable } from "./property.js";

import type { SystemFields } from "./system.js";

export type EntitySchema = Record<string, Property<any, any, any>>;

type InferPropertyValue<TProperty> =
  IsNullable<TProperty> extends true
    ? PropertyType<TProperty> | null
    : PropertyType<TProperty>;

export type InferEntity<
  TSchema extends EntitySchema,
  TIncludeSystemFields extends boolean = true,
> = {
  [K in keyof TSchema]: InferPropertyValue<TSchema[K]>;
} & (TIncludeSystemFields extends true ? SystemFields : {});
