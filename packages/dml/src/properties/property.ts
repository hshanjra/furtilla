export type PropertyKind =
  | "id"
  | "text"
  | "number"
  | "float"
  | "boolean"
  | "date_time"
  | "json"
  | "array"
  | "enum"
  | "big_number";

export interface PropertyOptions {
  nullable?: boolean;
  unique?: boolean;
  primaryKey?: boolean;
  default?: unknown;
  generated?: boolean;
}

export abstract class Property<
  TValue,
  TKind extends PropertyKind,
  TSelf extends Property<TValue, TKind, TSelf>,
> {
  readonly type: TKind;
  readonly options: PropertyOptions;

  protected constructor(type: TKind, options: PropertyOptions = {}) {
    this.type = type;
    this.options = options;
  }

  nullable(): TSelf {
    return this.clone({
      nullable: true,
    });
  }

  unique(): TSelf {
    return this.clone({
      unique: true,
    });
  }

  primaryKey(): TSelf {
    return this.clone({
      primaryKey: true,
    });
  }

  default(value: unknown): TSelf {
    return this.clone({
      default: value,
    });
  }

  protected abstract clone(options: PropertyOptions): TSelf;
}
