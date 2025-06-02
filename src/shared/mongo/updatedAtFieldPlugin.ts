import { Schema, Document } from 'mongoose';

export function updatedAtFieldPlugin(schema: Schema) {
  schema.pre(['save', 'findOneAndUpdate'], function (next) {
    if (this instanceof Document) {
      this.updatedAt = new Date();
    } else {
      this.set({ updatedAt: new Date() });
    }
    next();
  });
}
