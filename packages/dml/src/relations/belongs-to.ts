import { Relation, type RelationshipOptions } from "./relation.js";

export class BelongsTo<
  TTarget,
  TForeignKeyName extends string | undefined = undefined,
> extends Relation<TTarget, "belongs_to"> {
  readonly kind = "belongs_to" as const;

  declare readonly options: RelationshipOptions & {
    foreignKeyName?: TForeignKeyName;
  };

  constructor(target: () => TTarget, options: RelationshipOptions = {}) {
    super(target, options);
  }
}
