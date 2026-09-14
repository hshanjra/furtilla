export type DefineOptions =
  | string
  | {
      name?: string;
      tableName?: string;
    };

export interface EntityConfig {
  readonly name: string;
  readonly tableName: string;
}
