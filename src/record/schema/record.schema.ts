import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { HydratedDocument } from 'mongoose'

export type AccountDocument = HydratedDocument<Record>

// validUntil, validAfter, sessionVerificationModule address, validationData, merkleProof, signature
@Schema()
export class Record {
  @Prop()
  icao24: string

  @Prop()
  callsign: string

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Airspace' })
  airspace: string

  @Prop()
  origin_country: string

  // @Prop()
  // flight: string

  @Prop()
  entryDate: Date

  @Prop()
  exitDate: Date

  @Prop()
  lastHeading: number

  @Prop()
  coordinates: Array<[number, number]>
}

export const RecordSchema = SchemaFactory.createForClass(Record)
