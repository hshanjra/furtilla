export interface EntityConfig {
  name?: string;
  tableName: string;
}

export type EntityNameOrConfig = string | EntityConfig;
