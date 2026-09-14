import type { Property } from "../properties/property.js";
import type { Relation } from "../relations/relation.js";

export type EntityField = Property<any, any, any> | Relation<any, any>;

export type EntitySchema = Record<string, EntityField>;
