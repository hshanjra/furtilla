export type SnakeToCamel<T extends string> =
  T extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
    : T;
