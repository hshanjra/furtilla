import type { Property } from "../properties/property.js";

export type EntitySchema = Record<string, Property<any, any, any>>;

export type PropertyValue<TProperty> =
  TProperty extends Property<infer TValue, any, any> ? TValue : never;

export type IsNullable<TProperty> = TProperty extends {
  options: infer TOptions;
}
  ? TOptions extends {
      nullable: true;
    }
    ? true
    : false
  : false;

export type InferPropertyValue<TProperty> =
  IsNullable<TProperty> extends true
    ? PropertyValue<TProperty> | null
    : PropertyValue<TProperty>;

export type InferEntity<TSchema extends EntitySchema> = {
  [K in keyof TSchema]: InferPropertyValue<TSchema[K]>;
} & {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
