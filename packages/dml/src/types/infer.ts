import type { Property } from "../properties/property.js";
import type { Relation } from "../relations/relation.js";
import type { EntitySchema } from "./entity.js";

export type PropertyValue<T> =
  T extends Property<infer TValue, any, any> ? TValue : never;

export type IsNullable<T> = T extends {
  options: {
    nullable: true;
  };
}
  ? true
  : false;

type InferProperty<T> =
  T extends Property<any, any, any>
    ? IsNullable<T> extends true
      ? PropertyValue<T> | null
      : PropertyValue<T>
    : never;

type RelationTarget<T> =
  T extends Relation<infer TTarget, any> ? TTarget : never;

type InferRelation<T> =
  T extends Relation<any, infer TKind>
    ? TKind extends "has_many" | "many_to_many"
      ? RelationTarget<T>[]
      : RelationTarget<T> | null
    : never;

export type InferEntity<TSchema extends EntitySchema> = {
  -readonly [K in keyof TSchema]: TSchema[K] extends Property<any, any, any>
    ? InferProperty<TSchema[K]>
    : TSchema[K] extends Relation<any, any>
      ? InferRelation<TSchema[K]>
      : never;
} & {
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};
