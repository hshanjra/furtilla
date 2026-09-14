import { Property, type PropertyOptions } from "./property.js";

export interface IdOptions extends PropertyOptions {
  prefix?: string;
}

export class IdProperty extends Property<string, "id", IdProperty> {
  readonly prefix: string | undefined;

  constructor(options: IdOptions = {}) {
    super("id", options);

    this.prefix = options.prefix;
  }

  protected clone(options: PropertyOptions): IdProperty {
    const nextOptions: IdOptions = {
      ...options,
    };

    if (this.prefix !== undefined) {
      nextOptions.prefix = this.prefix;
    }

    return new IdProperty(nextOptions);
  }
}
