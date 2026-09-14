export function snakeToCamel(value: string): string {
  return value.replace(/_([a-zA-Z0-9])/g, (_, character: string) =>
    character.toUpperCase(),
  );
}
export function toPascalCase(value: string): string {
  return value
    .split(/[_\-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

export function toCamelCase(value: string): string {
  const pascal = toPascalCase(value);

  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
}

export function normalizeEntityName(value: string): string {
  return toCamelCase(value);
}

export function normalizeTableName(value: string): string {
  return value
    .replace(/([a-z0-9])([A-Z])/g, "$1_$2")
    .replace(/[\s\-]+/g, "_")
    .toLowerCase();
}
