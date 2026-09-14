import { model } from "./index.js";

import type {
  InferEntity,
  InferCreateInput,
  InferUpdateInput,
} from "./index.js";

const User = model.define("user_data", {
  id: model.id({
    prefix: "usr",
  }),

  email: model.text().unique(),

  name: model.text().nullable(),

  age: model.number().nullable(),

  active: model.boolean().default(true),

  status: model.enum(["active", "inactive"]),
});

type UserEntity = InferEntity<typeof User.fields>;

type UserCreate = InferCreateInput<typeof User.fields>;

type UserUpdate = InferUpdateInput<typeof User.fields>;
