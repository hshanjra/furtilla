import type { Property } from "../properties/property.js";

export type PropertyType<TProperty> =
  TProperty extends Property<infer TValue, any, any> ? TValue : never;

export type PropertyOptionsOf<TProperty> =
  TProperty extends Property<any, any, any> ? TProperty["options"] : never;

export type IsNullable<TProperty> =
  PropertyOptionsOf<TProperty> extends {
    nullable: true;
  }
    ? true
    : false;

export type IsPrimaryKey<TProperty> =
  PropertyOptionsOf<TProperty> extends {
    primaryKey: true;
  }
    ? true
    : false;

export type HasDefault<TProperty> =
  PropertyOptionsOf<TProperty> extends {
    default: unknown;
  }
    ? true
    : false;
