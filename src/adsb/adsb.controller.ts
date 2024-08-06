import { Controller, Get, Param, Sse } from '@nestjs/common'
import { ADSBService } from './adsb.service'
import { Observable, interval, map, mergeMap } from 'rxjs'

@Controller('/api/v1/adsb')
export class ADSBController {
  constructor(private readonly adsbService: ADSBService) {}

  @Get('/:id')
  async getAirspaceStates(@Param('id') airspaceId: string) {
    return await this.adsbService.getAirspaceStates(airspaceId)
  }

  @Sse('/sse/:id')
  sse(@Param('id') airspaceId: string): Observable<MessageEvent> {
    return interval(5000).pipe(
      mergeMap(async _ => {
        const data = await this.adsbService.getAirspaceStates(airspaceId)
        return { data } as MessageEvent
      })
    )
  }

  @Get('/:id/:from')
  async getAirspaceHistory(@Param('id') airspaceId: string, @Param('from') from: string) {
    return await this.adsbService.getAirspaceHistory(airspaceId, from)
  }

  @Get('/route/aircraft/:icao24/:time')
  async getAircraftRoute(@Param('icao24') aircraft: string, @Param('time') time: number) {
    return await this.adsbService.getAircraftRoute(aircraft, time)
  }
}
