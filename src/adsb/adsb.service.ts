import { Injectable } from '@nestjs/common'
import { ADSBLolApiService } from './service/adsblol'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class ADSBService {
  endpoint: string = 'https://api.adsb.lol/v2'

  async getAircraftSurroundPoint(latitude: number, longitude: number, radius: number) {
    const res = await fetch(
      // 'https://opensky-network.org/api/states/all?extended=1&lamin=-85.05112900000009&lomin=-203.04088594010116&lamax=85.05112877980659&lomax=181.73644745141752',
      // 'https://opensky-network.org/api/flights/all?begin=1517184000&end=1517270400',
      // 'https://opensky-network.org/api/states/all',
      `${this.endpoint}/point/${latitude}/${longitude}/${radius}`
      // 'https://opensky-network.org/api/states/all?begin=1517184000&end=1517270400',
      // 'https://opensky-network.org/api/flights/aircraft?icao24=e88088&begin=1517184000&end=1517270400',
    )
    const data = await res.json()

    return data['ac']
  }
}
