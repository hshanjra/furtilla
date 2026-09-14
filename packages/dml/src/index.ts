export { EntityBuilder, model } from "./entity/index.js";

export type { EntityDefinition, EntitySchema } from "./entity/index.js";

export {
  Property,
  IdProperty,
  TextProperty,
  NumberProperty,
  FloatProperty,
  BigNumberProperty,
  BooleanProperty,
  DateTimeProperty,
  JSONProperty,
  ArrayProperty,
  EnumProperty,
} from "./properties/index.js";

export type {
  PropertyKind,
  PropertyOptions,
  IdOptions,
} from "./properties/index.js";

export type { InferEntity } from "./types/entity.js";

export type { InferCreateInput, InferUpdateInput } from "./types/input.js";

export type { PropertyType } from "./types/property.js";

export type { SystemFields } from "./types/system.js";
