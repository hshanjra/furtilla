import type { Property } from "../properties/property.js";

import type {
  PropertyType,
  IsNullable,
  HasDefault,
  IsPrimaryKey,
} from "./property.js";

export type EntitySchema = Record<string, Property<any, any, any>>;

type CreateValue<TProperty> =
  IsNullable<TProperty> extends true
    ? PropertyType<TProperty> | null
    : PropertyType<TProperty>;

type IsOptionalCreateField<TProperty> =
  HasDefault<TProperty> extends true
    ? true
    : IsPrimaryKey<TProperty> extends true
      ? true
      : false;

type RequiredCreateFields<TSchema extends EntitySchema> = {
  [
    K in keyof TSchema as IsOptionalCreateField<TSchema[K]> extends true
      ? never
      : K
  ]: CreateValue<TSchema[K]>;
};

type OptionalCreateFields<TSchema extends EntitySchema> = {
  [
    K in keyof TSchema as IsOptionalCreateField<TSchema[K]> extends true
      ? K
      : never
  ]?: CreateValue<TSchema[K]>;
};

export type InferCreateInput<TSchema extends EntitySchema> =
  RequiredCreateFields<TSchema> & OptionalCreateFields<TSchema>;

export type InferUpdateInput<TSchema extends EntitySchema> = Partial<{
  [K in keyof TSchema]: CreateValue<TSchema[K]>;
}>;
