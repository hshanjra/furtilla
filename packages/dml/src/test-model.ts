import { model } from "./index.js";

export const User = model.define("user", {
  id: model.id({ prefix: "usr" }).primaryKey(),

  email: model.text().unique(),

  name: model.text().nullable(),

  age: model.number().default(0),

  score: model.float(),

  balance: model.bigNumber(),

  active: model.boolean().default(true),

  birthDate: model.dateTime().nullable(),

  metadata: model.json(),

  tags: model.array(),

  status: model.enum(["active", "inactive", "suspended"]),
});
