import { Relation, type RelationshipOptions } from "./relation.js";

export class HasOne<TTarget> extends Relation<TTarget, "has_one"> {
  readonly kind = "has_one" as const;

  constructor(target: () => TTarget, options: RelationshipOptions = {}) {
    super(target, options);
  }
}

export class HasOneWithForeignKey<
  TTarget,
  TForeignKeyName extends string | undefined = undefined,
> extends HasOne<TTarget> {
  declare readonly options: RelationshipOptions & {
    foreignKey: true;
    foreignKeyName?: TForeignKeyName;
  };
}
