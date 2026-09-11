import * as fields from "./fields/index.js";
import { define } from "./model/define.js";

export const model = {
  define,

  id: fields.id,
  string: fields.string,
  number: fields.number,
  boolean: fields.boolean,
  date: fields.date,
};

export type { ModelDefinition } from "./model/model.js";
