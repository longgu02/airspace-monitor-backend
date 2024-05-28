import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { AirspaceService } from './airspace.service'
import { AirspaceDto } from './dto/airspace.dto'

@Controller('/api/v1/airspace')
export class AirspaceController {
  constructor(private readonly airspaceService: AirspaceService) {}

  @Get('/:id')
  async getAirspace(@Param('id') id: string) {
    return await this.airspaceService.getAirspace(id)
  }

  @Post('/')
  async createAirspace(@Body() airspaceDto: AirspaceDto) {
    return await this.airspaceService.createAirspace(
      airspaceDto.name,
      airspaceDto.lat,
      airspaceDto.lon,
      airspaceDto.rad
    )
  }
}
