import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Option {
  @Prop({ type: [String], default: undefined })
  classe?: string[];

  @Prop({ type: [String], default: undefined })
  filiere?: string[];

  @Prop({ type: [String], required: true })
  bound_to: string[];

  @Prop({ type: String, required: true })
  name: string;
}

export const OptionsSchema = SchemaFactory.createForClass(Option);
