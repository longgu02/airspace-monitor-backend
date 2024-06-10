import { Module } from '@nestjs/common'
import { ADSBController } from './adsb.controller'
import { ADSBService } from './adsb.service'
import { RecordService } from 'src/record/record.service'
import { RecordModule } from 'src/record/record.module'
import { Airspace } from 'src/airspace/schema/airspace.schema'
import { AirspaceModule } from 'src/airspace/airspace.module'

@Module({
  imports: [RecordModule, AirspaceModule],
  controllers: [ADSBController],
  providers: [ADSBService],
  exports: []
})
export class ADSBModule {}
