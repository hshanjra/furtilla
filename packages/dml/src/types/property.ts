import type { Property } from "../properties/property.js";

export type PropertyType<TProperty> =
  TProperty extends Property<infer TType, any, any> ? TType : never;

export type IsNullable<TProperty> =
  TProperty extends Property<any, any, any>
    ? TProperty["options"] extends { nullable: true }
      ? true
      : false
    : false;
