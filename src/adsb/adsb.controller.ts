import { Controller, Get, Param } from '@nestjs/common'
import { ADSBService } from './adsb.service'

@Controller('/api/v1/adsb')
export class ADSBController {
  constructor(private readonly adsbService: ADSBService) {}

  @Get('/:lat/:lon/:rad')
  async getAirspaceStates(
    @Param('lat') latitude: number,
    @Param('lon') longitude: number,
    @Param('rad') radius: number
  ) {
    return await this.adsbService.getAircraftSurroundPoint(latitude, longitude, radius)
  }
}
