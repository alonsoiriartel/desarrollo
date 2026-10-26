import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ collection: 'items', timestamps: true, versionKey: false })
export class MongoItem {
  @Prop({ type: String, required: true })
  _id!: string;

  @Prop({ type: String, required: true, maxlength: 100 })
  nombre!: string;

  @Prop({ type: Number, required: true, min: 0 })
  cantidad!: number;

  @Prop({ type: Boolean, required: true })
  activo!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const MongoItemSchema = SchemaFactory.createForClass(MongoItem);
