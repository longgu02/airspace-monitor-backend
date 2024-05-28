import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type AccountDocument = HydratedDocument<Record>

// validUntil, validAfter, sessionVerificationModule address, validationData, merkleProof, signature
@Schema()
export class Record {
  @Prop()
  hex: string

  @Prop()
  registration: number

  @Prop()
  type: number

  @Prop()
  flight: number

  @Prop()
  coordinate: Array<[number, number]>
}

export const RecordSchema = SchemaFactory.createForClass(Record)
