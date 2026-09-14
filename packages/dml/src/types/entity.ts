import type { Property } from "../properties/property.js";
import type { PropertyType } from "./property.js";
import type { SystemFields } from "./system.js";

export type EntitySchema = Record<string, Property<any, any, any>>;

export type InferEntity<
  TSchema extends EntitySchema,
  TIncludeSystemFields extends boolean = true,
> = {
  [K in keyof TSchema]: PropertyType<TSchema[K]>;
} & (TIncludeSystemFields extends true ? SystemFields : {});
