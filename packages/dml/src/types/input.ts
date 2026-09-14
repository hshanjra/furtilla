import type { Property } from "../properties/property.js";
import type { PropertyType } from "./property.js";

export type EntitySchema = Record<string, Property<any, any, any>>;

type IsOptional<TProperty> =
  TProperty extends Property<any, any, any>
    ? TProperty["options"] extends { default: any }
      ? true
      : false
    : false;

type RequiredCreateFields<TSchema extends EntitySchema> = {
  [
    K in keyof TSchema as IsOptional<TSchema[K]> extends true ? never : K
  ]: PropertyType<TSchema[K]>;
};

type OptionalCreateFields<TSchema extends EntitySchema> = {
  [
    K in keyof TSchema as IsOptional<TSchema[K]> extends true ? K : never
  ]?: PropertyType<TSchema[K]>;
};

export type InferCreateInput<TSchema extends EntitySchema> =
  RequiredCreateFields<TSchema> & OptionalCreateFields<TSchema>;

export type InferUpdateInput<TSchema extends EntitySchema> = Partial<{
  [K in keyof TSchema]: PropertyType<TSchema[K]>;
}>;
