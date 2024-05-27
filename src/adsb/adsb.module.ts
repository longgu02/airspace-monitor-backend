import { Module } from '@nestjs/common'
import { ADSBController } from './adsb.controller'
import { ADSBService } from './adsb.service'

@Module({
  imports: [],
  controllers: [ADSBController],
  providers: [ADSBService],
  exports: []
})
export class ADSBModule {}
