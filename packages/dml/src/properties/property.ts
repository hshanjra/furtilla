import type { PropertyConfig } from "../types/property-config.js";

export interface PropertyOptions {
  nullable?: boolean;
  unique?: boolean;
  primaryKey?: boolean;
  default?: unknown;
}

export type PropertyKind =
  | "id"
  | "text"
  | "number"
  | "float"
  | "big_number"
  | "boolean"
  | "date_time"
  | "json"
  | "array"
  | "enum";

export abstract class Property<
  TValue,
  TKind extends PropertyKind,
  TSelf extends Property<TValue, TKind, TSelf>,
> {
  readonly kind: TKind;
  readonly options: PropertyOptions;

  protected constructor(kind: TKind, options: PropertyOptions = {}) {
    this.kind = kind;
    this.options = options;
  }

  nullable(): TSelf {
    return this.clone({
      ...this.options,
      nullable: true,
    });
  }

  unique(): TSelf {
    return this.clone({
      ...this.options,
      unique: true,
    });
  }

  primaryKey(): TSelf {
    return this.clone({
      ...this.options,
      primaryKey: true,
    });
  }

  default(value: TValue): TSelf {
    return this.clone({
      ...this.options,
      default: value,
    });
  }

  protected abstract clone(options: PropertyOptions): TSelf;

  declare readonly __type: TValue;

  declare readonly __config: PropertyConfig;
}
