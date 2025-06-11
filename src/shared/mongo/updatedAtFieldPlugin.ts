import { Schema } from 'mongoose';

export function updatedAtFieldPlugin(schema: Schema) {
  schema.pre('save', function (next) {
    (this as any).updatedAt = new Date();
    next();
  });

  schema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate() as Record<string, any>;

    if (!update.$set) {
      update.$set = {};
    }

    update.$set.updatedAt = new Date();
    this.setUpdate(update);

    next();
  });
}
