import { Injectable, Logger } from '@nestjs/common'
import { ADSBLolApiService } from './service/adsblol'
import { InjectModel } from '@nestjs/mongoose'
import { Cron, CronExpression } from '@nestjs/schedule'

@Injectable()
export class ADSBService {
  endpoint: string = 'https://api.adsb.lol/v2'
  private readonly logger = new Logger(ADSBService.name)
  previouslyFetched = []
  pendingData = {}

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

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    console.log('alo alo alo alo alo')
    this.logger.debug('aloaloalaoalaoalao')
    const res = await this.getAircraftSurroundPoint(21.028511, 105.804817, 250)
    // console.log('this is fetched 1', this.previouslyFetched.slice(0, 1))

    const { entries, exits } = this.findDataDifferences(this.previouslyFetched, res)
    entries.map(entry => {
      console.log('added: ', entry.hex)
      this.pendingData[entry.hex] = {
        flight: entry.flight,
        registration: entry.r,
        type: entry.t,
        coordinates: [[entry.lat, entry.lon]]
      }
    })

    exits.map(exit => {
      console.log('removed: ', exit.hex)
      // Store in database

      // Remove from pending data
      this.pendingData[exit.hex] = undefined
    })

    // console.log(this.findDataDifferences(this.previouslyFetched, res))

    this.previouslyFetched = res
    // console.log('this is fetched 2', this.previouslyFetched.slice(0, 1))
    // console.log(diff2(this.previouslyFetched))
    res.map(flight => {
      if (!entries.some(data => data.hex == flight.hex)) {
        console.log('update: ', flight.hex)
        this.pendingData[flight.hex].coordinates.push([flight.lat, flight.lon])
      }
    })
    console.log(this.pendingData)

    // console.log(this.pendingData.coordinates[0])
    // console.log('this is res', res)
  }

  findDataDifferences(oldData: any, newData: any): { entries: any; exits: any } {
    const oldHexSet = new Set(oldData.map(item => item.hex))
    const newHexSet = new Set(newData.map(item => item.hex))

    const added = newData.filter(item => !oldHexSet.has(item.hex))
    const removed = oldData.filter(item => !newHexSet.has(item.hex))

    return { entries: added, exits: removed }
  }
}
