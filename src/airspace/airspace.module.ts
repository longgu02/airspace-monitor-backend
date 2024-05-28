import { Module } from '@nestjs/common'
import { AirspaceController } from './airspace.controller'
import { AirspaceService } from './airspace.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Airspace, AirspaceSchema } from './schema/airspace.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Airspace.name, schema: AirspaceSchema }])],
  controllers: [AirspaceController],
  providers: [AirspaceService],
  exports: []
})
export class AirspaceModule {}
