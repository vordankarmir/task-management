import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

export type MemberDocument = HydratedDocument<Member>;

@Schema({ timestamps: true })
export class Member {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  })
  _id: string;
}

export const MemberSchema = SchemaFactory.createForClass(Member);
