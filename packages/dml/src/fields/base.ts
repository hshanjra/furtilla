export type FieldKind = "id" | "string" | "number" | "boolean" | "date";

export interface FieldOptions {
  nullable?: boolean;
  optional?: boolean;
  default?: unknown;
}

export interface FieldDefinition<TType, TKind extends FieldKind = FieldKind> {
  readonly kind: TKind;
  readonly options: FieldOptions;

  readonly __type?: TType;
}
