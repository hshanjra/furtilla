export type RelationKind =
  "has_one" | "belongs_to" | "has_many" | "many_to_many";

export interface RelationshipOptions {
  mappedBy?: string;
  inversedBy?: string;
  foreignKey?: boolean;
  foreignKeyName?: string;
}

export interface RelationMetadata {
  readonly kind: RelationKind;
  readonly target: () => unknown;

  readonly mappedBy?: string;
  readonly inversedBy?: string;

  readonly foreignKey: boolean;
  readonly foreignKeyName?: string;

  readonly pivotTable?: string;
  readonly joinColumn?: string | string[];
  readonly inverseJoinColumn?: string | string[];
}

export abstract class Relation<TTarget, TKind extends RelationKind> {
  readonly __relation = true as const;

  abstract readonly kind: TKind;

  readonly target: () => TTarget;
  readonly options: RelationshipOptions;

  protected constructor(
    target: () => TTarget,
    options: RelationshipOptions = {},
  ) {
    this.target = target;
    this.options = options;
  }

  get metadata(): RelationMetadata {
    const metadata: RelationMetadata = {
      kind: this.kind,
      target: this.target,
      foreignKey: this.options.foreignKey ?? false,
    };

    if (this.options.mappedBy !== undefined) {
      return {
        ...metadata,
        mappedBy: this.options.mappedBy,
      };
    }

    if (this.options.inversedBy !== undefined) {
      return {
        ...metadata,
        inversedBy: this.options.inversedBy,
      };
    }

    if (this.options.foreignKeyName !== undefined) {
      return {
        ...metadata,
        foreignKeyName: this.options.foreignKeyName,
      };
    }

    return metadata;
  }
}
