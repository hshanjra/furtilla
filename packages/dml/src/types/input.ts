import type { EntitySchema } from "./entity.js";

import type { IsNullable, PropertyValue } from "./entity.js";

type IsGenerated<TProperty> = TProperty extends {
  options: infer TOptions;
}
  ? TOptions extends {
      generated: true;
    }
    ? true
    : false
  : false;

type IsDefaulted<TProperty> = TProperty extends {
  options: infer TOptions;
}
  ? TOptions extends {
      default: infer _;
    }
    ? true
    : false
  : false;

type CreateValue<TProperty> =
  IsNullable<TProperty> extends true
    ? PropertyValue<TProperty> | null
    : PropertyValue<TProperty>;

type RequiredCreateFields<TSchema extends EntitySchema> = {
  [
    K in keyof TSchema as IsGenerated<TSchema[K]> extends true
      ? never
      : IsDefaulted<TSchema[K]> extends true
        ? never
        : K
  ]: CreateValue<TSchema[K]>;
};

type OptionalCreateFields<TSchema extends EntitySchema> = {
  [
    K in keyof TSchema as IsGenerated<TSchema[K]> extends true
      ? K
      : IsDefaulted<TSchema[K]> extends true
        ? K
        : never
  ]?: CreateValue<TSchema[K]>;
};

export type InferCreateInput<TSchema extends EntitySchema> =
  RequiredCreateFields<TSchema> & OptionalCreateFields<TSchema>;

export type InferUpdateInput<TSchema extends EntitySchema> = Partial<{
  [K in keyof TSchema]: CreateValue<TSchema[K]>;
}>;
