import type { PropertyKind } from "../properties/property.js";

export interface PropertyMetadata {
  readonly kind: PropertyKind;

  readonly nullable: boolean;
  readonly unique: boolean;
  readonly primaryKey: boolean;
  readonly generated: boolean;

  readonly hasDefault: boolean;
  readonly defaultValue?: unknown;

  readonly prefix?: string;

  readonly enumValues?: readonly unknown[];
}
