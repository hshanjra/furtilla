import {
  Relation,
  type RelationshipOptions,
  type RelationMetadata,
} from "./relation.js";

export interface ManyToManyOptions extends RelationshipOptions {
  pivotTable?: string;
  joinColumn?: string | string[];
  inverseJoinColumn?: string | string[];
}

export class ManyToMany<TTarget> extends Relation<TTarget, "many_to_many"> {
  readonly kind = "many_to_many" as const;

  readonly manyToManyOptions: ManyToManyOptions;

  constructor(target: () => TTarget, options: ManyToManyOptions = {}) {
    super(target, options);

    this.manyToManyOptions = options;
  }

  override get metadata(): RelationMetadata {
    const base = super.metadata;

    return {
      ...base,

      ...(this.manyToManyOptions.pivotTable !== undefined
        ? {
            pivotTable: this.manyToManyOptions.pivotTable,
          }
        : {}),

      ...(this.manyToManyOptions.joinColumn !== undefined
        ? {
            joinColumn: this.manyToManyOptions.joinColumn,
          }
        : {}),

      ...(this.manyToManyOptions.inverseJoinColumn !== undefined
        ? {
            inverseJoinColumn: this.manyToManyOptions.inverseJoinColumn,
          }
        : {}),
    };
  }
}
