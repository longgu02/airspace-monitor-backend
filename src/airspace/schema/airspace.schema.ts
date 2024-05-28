import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type AccountDocument = HydratedDocument<Airspace>

// validUntil, validAfter, sessionVerificationModule address, validationData, merkleProof, signature
@Schema()
export class Airspace {
  @Prop()
  name: string

  // @Prop()
  // coordinate: Array<[number, number]>

  @Prop()
  lat: number

  @Prop()
  lon: number

  @Prop()
  rad: number

  // @Prop()
  // type: 'circle' | 'rectangle'
}

export const AirspaceSchema = SchemaFactory.createForClass(Airspace)
