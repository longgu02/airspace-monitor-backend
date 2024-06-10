import { Injectable, Logger } from '@nestjs/common'
import { ADSBLolApiService } from './service/adsblol'
import { InjectModel } from '@nestjs/mongoose'
import { Cron, CronExpression } from '@nestjs/schedule'
import { RecordService } from 'src/record/record.service'
import { AirspaceService } from 'src/airspace/airspace.service'

@Injectable()
export class ADSBService {
  constructor(
    private readonly airspaceService: AirspaceService,
    private readonly recordService: RecordService
  ) {}

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

  async getAirspaceHistory(airspaceId: string, from: string) {
    const matchedAirspaceId = await this.airspaceService.getAirspace(airspaceId)

    const res = await fetch(
      `https://opensky-network.org/api/states/all?lamin=${matchedAirspaceId.latMin}&lomin=${matchedAirspaceId.lonMin}&lamax=${matchedAirspaceId.latMax}&lomax=${matchedAirspaceId.lonMax}&time=${from}`,
      {
        headers: {
          Authorization: 'Basic ' + btoa('plong12112002' + ':' + 'Long12112002')
        }
      }
    )

    // const data = await res.json()
    // let response = []
    // await data['states'].map(it => {
    //   const r = {
    //     icao24: it[0],
    //     callsign: it[1],
    //     origin_country: it[2],
    //     time_position: it[3],
    //     last_contact: it[4],
    //     longitude: it[5],
    //     latitude: it[6],
    //     baro_altitude: it[7],
    //     on_ground: it[8],
    //     velocity: it[9],
    //     true_track: it[10],
    //     vertical_rate: it[11],
    //     sensors: it[12],
    //     geo_altitude: it[13],
    //     squawk: it[14],
    //     spi: it[15],
    //     position_source: it[16],
    //     category: it[17]
    //   }
    //   response.push(r)
    // })

    return await res.text()
  }

  async getAirspaceStates(airspaceId: string) {
    const matchedAirspaceId = await this.airspaceService.getAirspace(airspaceId)

    const res = await fetch(
      // 'https://opensky-network.org/api/states/all?extended=1&lamin=-85.05112900000009&lomin=-203.04088594010116&lamax=85.05112877980659&lomax=181.73644745141752',
      // 'https://opensky-network.org/api/flights/all?begin=1517184000&end=1517270400',
      // 'https://opensky-network.org/api/states/all',
      `https://opensky-network.org/api/states/all?lamin=${matchedAirspaceId.latMin}&lomin=${matchedAirspaceId.lonMin}&lamax=${matchedAirspaceId.latMax}&lomax=${matchedAirspaceId.lonMax}`,
      // `${this.endpoint}/point/21.028511/105.804817/250`,
      // 'https://opensky-network.org/api/states/all?begin=1517184000&end=1517270400',
      // 'https://opensky-network.org/api/flights/aircraft?icao24=e88088&begin=1517184000&end=1517270400',
      {
        headers: {
          Authorization: 'Basic ' + btoa('plong12112002' + ':' + 'Long12112002')
        }
      }
    )
    const data = await res.json()
    let response = []
    await data['states'].map(it => {
      const r = {
        icao24: it[0],
        callsign: it[1],
        origin_country: it[2],
        time_position: it[3],
        last_contact: it[4],
        longitude: it[5],
        latitude: it[6],
        baro_altitude: it[7],
        on_ground: it[8],
        velocity: it[9],
        true_track: it[10],
        vertical_rate: it[11],
        sensors: it[12],
        geo_altitude: it[13],
        squawk: it[14],
        spi: it[15],
        position_source: it[16],
        category: it[17]
      }
      response.push(r)
    })

    return response
    // return data['ac']
  }

  async getAllStates() {
    const res = await fetch(
      // 'https://opensky-network.org/api/states/all?extended=1&lamin=-85.05112900000009&lomin=-203.04088594010116&lamax=85.05112877980659&lomax=181.73644745141752',
      // 'https://opensky-network.org/api/flights/all?begin=1517184000&end=1517270400',
      'https://opensky-network.org/api/states/all',
      // `https://opensky-network.org/api/states/all?lamin=${matchedAirspaceId.latMin}&lomin=${matchedAirspaceId.lonMin}&lamax=${matchedAirspaceId.latMax}&lomax=${matchedAirspaceId.lonMax}`,
      // `${this.endpoint}/point/21.028511/105.804817/250`,
      // 'https://opensky-network.org/api/states/all?begin=1517184000&end=1517270400',
      // 'https://opensky-network.org/api/flights/aircraft?icao24=e88088&begin=1517184000&end=1517270400',
      {
        headers: {
          Authorization: 'Basic ' + btoa('plong12112002' + ':' + 'Long12112002')
        }
      }
    )
    const data = await res.json()
    let response = []
    await data['states'].map(it => {
      const r = {
        icao24: it[0],
        callsign: it[1],
        origin_country: it[2],
        time_position: it[3],
        last_contact: it[4],
        longitude: it[5],
        latitude: it[6],
        baro_altitude: it[7],
        on_ground: it[8],
        velocity: it[9],
        true_track: it[10],
        vertical_rate: it[11],
        sensors: it[12],
        geo_altitude: it[13],
        squawk: it[14],
        spi: it[15],
        position_source: it[16],
        category: it[17]
      }
      response.push(r)
    })

    return response
    // return data['ac']
  }

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleCron() {
    let init = false
    const airspaces = await this.airspaceService.getAllAirspace()

    this.logger.debug('Fetching ADS-B Data')
    // const res = await this.getAircraftSurroundPoint(21.028511, 105.804817, 250)
    const res = await this.getAllStates()
    const aircraftInAirspaces = airspaces.map(airspace => {
      return {
        id: airspace._id,
        aircraft: res.filter(aircraft => {
          return (
            aircraft.latitude >= airspace.latMin &&
            aircraft.latitude <= airspace.latMax &&
            aircraft.longitude >= airspace.lonMin &&
            aircraft.longitude <= airspace.lonMax
          )
        })
      }
    })
    // console.log(res)
    // console.log('this is fetched 1', this.previouslyFetched.slice(0, 1))
    console.log(aircraftInAirspaces)
    if (this.previouslyFetched.length == 0) {
      this.previouslyFetched = aircraftInAirspaces
      await aircraftInAirspaces.map(async airspace => {
        await airspace.aircraft.map(async entry => {
          console.log('added: ', entry.icao24)
          const res = await this.recordService.createEntranceRecord(
            String(airspace.id),
            entry.icao24,
            entry.callsign,
            entry.origin_country,
            [entry.longitude, entry.latitude]
          )
          this.pendingData[entry.icao24] = {
            id: res._id,
            airspace: airspace.id,
            // icao24: entry.icao24,
            callsign: entry.callsign,
            origin_country: entry.origin_country,
            time: entry.time_position,
            velocity: entry.velocity,
            true_track: entry.true_track,
            coordinates: [[entry.longitude, entry.latitude]]
          }
        })
      })
      init = true
    }

    await aircraftInAirspaces.map(async (data, index) => {
      console.log('ID: ', data.id)
      const { entries, exits } = this.findDataDifferences(this.previouslyFetched[index].aircraft, data.aircraft)
      await entries.map(async entry => {
        console.log('added: ', entry.icao24)
        const res = await this.recordService.createEntranceRecord(
          String(data.id),
          entry.icao24,
          entry.callsign,
          entry.origin_country,
          [entry.longitude, entry.latitude]
        )
        this.pendingData[entry.icao24] = {
          id: res._id,
          airspace: data.id,
          // icao24: entry.icao24,
          callsign: entry.callsign,
          origin_country: entry.origin_country,
          time: entry.time_position,
          velocity: entry.velocity,
          true_track: entry.true_track,
          coordinates: [[entry.longitude, entry.latitude]]
        }
      })

      exits.map(exit => {
        console.log('removed: ', exit.icao24)
        // Store in database
        this.recordService.createExitRecord(
          this.pendingData[exit.icao24].id,
          exit.true_track,
          this.pendingData[exit.icao24].coordinates
        )
        // Remove from pending data
        this.pendingData[exit.icao24] = undefined
      })

      // console.log(this.findDataDifferences(this.previouslyFetched[index].aircraft, data.aircraft))

      this.previouslyFetched[index].aircraft = data.aircraft
      // console.log('this is fetched 2', this.previouslyFetched[index])
      // console.log(diff2(this.previouslyFetched))
      data.aircraft.map(flight => {
        if (!entries.some(_data => _data.icao24 == flight.icao24) && !init) {
          console.log('update: ', flight.icao24)
          this.pendingData[flight.icao24].coordinates.push([flight.longitude, flight.latitude])
        }
      })
    })
    console.log(this.pendingData)
    // const { entries, exits } = this.findDataDifferences(this.previouslyFetched, res)
    // await entries.map(async entry => {
    //   console.log('added: ', entry.icao24)
    //   // const res = await this.recordService.createEntranceRecord(entry.hex, entry.r, entry.t, [entry.lat, entry.lon])
    //   this.pendingData[entry.icao24] = {
    //     // id: res._id,
    //     icao24: entry.icao24,
    //     callsign: entry.callsign,
    //     country: entry.origin_country,
    //     time: entry.time_position,
    //     velocity: entry.velocity,
    //     true_track: entry.true_track,
    //     coordinates: [[entry.latitude, entry.longitude]]
    //   }
    // })

    // exits.map(exit => {
    //   console.log('removed: ', exit.hex)
    //   // Store in database
    //   // this.recordService.createExitRecord(
    //   //   this.pendingData[exit.hex].id,
    //   //   exit.true_heading,
    //   //   this.pendingData[exit.hex].coordinates
    //   // )
    //   // Remove from pending data
    //   this.pendingData[exit.icao24] = undefined
    // })

    // console.log(this.findDataDifferences(this.previouslyFetched, res))

    // this.previouslyFetched = res
    // console.log('this is fetched 2', this.previouslyFetched.slice(0, 1))
    // // console.log(diff2(this.previouslyFetched))
    // res.map(flight => {
    //   if (!entries.some(data => data.icao24 == flight.icao24)) {
    //     console.log('update: ', flight.icao24)
    //     this.pendingData[flight.icao24].coordinates.push([flight.lat, flight.lon])
    //   }
    // })
    // console.log(this.pendingData)

    // console.log(this.pendingData.coordinates[0])
    // console.log('this is res', res)
  }

  findDataDifferences(oldData: any, newData: any): { entries: any; exits: any } {
    const oldHexSet = new Set(oldData.map(item => item.icao24))
    const newHexSet = new Set(newData.map(item => item.icao24))

    const added = newData.filter(item => !oldHexSet.has(item.icao24))
    const removed = oldData.filter(item => !newHexSet.has(item.icao24))

    return { entries: added, exits: removed }
  }
}
