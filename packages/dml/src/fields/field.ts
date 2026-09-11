import type { FieldDefinition, FieldKind, FieldOptions } from "./base.js";

export class Field<TType, TKind extends FieldKind> implements FieldDefinition<
  TType,
  TKind
> {
  readonly __type?: TType;

  constructor(
    readonly kind: TKind,
    readonly options: FieldOptions = {},
  ) {}

  nullable() {
    return new Field<TType | null, TKind>(this.kind, {
      ...this.options,
      nullable: true,
    });
  }

  optional() {
    return new Field<TType | undefined, TKind>(this.kind, {
      ...this.options,
      optional: true,
    });
  }

  default(value: TType) {
    return new Field<TType, TKind>(this.kind, {
      ...this.options,
      default: value,
    });
  }
}
