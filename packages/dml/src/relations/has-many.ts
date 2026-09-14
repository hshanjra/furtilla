import { Relation, type RelationshipOptions } from "./relation.js";

export class HasMany<TTarget> extends Relation<TTarget, "has_many"> {
  readonly kind = "has_many" as const;

  constructor(target: () => TTarget, options: RelationshipOptions = {}) {
    super(target, options);
  }
}
