export function snakeToCamel(value: string): string {
  return value.replace(/_([a-zA-Z0-9])/g, (_, character: string) =>
    character.toUpperCase(),
  );
}
