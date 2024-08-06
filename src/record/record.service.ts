import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Record } from './schema/record.schema'
import { Model, ObjectId } from 'mongoose'

@Injectable()
export class RecordService {
  constructor(@InjectModel(Record.name) private recordModel: Model<Record>) {}

  async getRecords(airspaceId: string, from: number, to: number) {
    const fromDate = new Date(from)
    const toDate = new Date(to)

    const matchedRecords = await this.recordModel.find({
      $and: [
        {
          $or: [
            {
              entryDate: {
                $gte: fromDate,
                $lt: toDate
              }
            },
            {
              exitDate: {
                $gte: fromDate,
                $lt: toDate
              }
            }
          ]
        },
        {
          airspace: airspaceId
        }
      ]
    })

    const aircraftGroupedData = this.groupAndCombineDatesWithCoordinates(matchedRecords)
    // Object.keys(aircraftGroupedData).map(async aircraft => {
    //   if (aircraftGroupedData[aircraft].entryDates.length > 1) {
    //     console.log(
    //       `https://opensky-network.org/api/flights/aircraft?icao24=${aircraft}&begin=${aircraftGroupedData[aircraft].entryDates[0].date}&end=${aircraftGroupedData[aircraft].entryDates[aircraftGroupedData[aircraft].entryDates.length - 1].date}`
    //     )
    //     const res = await fetch(
    //       `https://opensky-network.org/api/flights/aircraft?icao24=${aircraft}&begin=${aircraftGroupedData[aircraft].entryDates[0].date}&end=${aircraftGroupedData[aircraft].entryDates[aircraftGroupedData[aircraft].entryDates.length - 1].date}`,
    //       {
    //         headers: {
    //           Authorization: 'Basic ' + btoa('plong12112002' + ':' + 'Long12112002')
    //         }
    //       }
    //     )
    //     // console.log(res)
    //     const data = await res.text()
    //     console.log(data)
    //     // data.map((it, index) => {
    //     //   aircraftGroupedData[aircraft].entryDates.map(en => {
    //     //     if (it.firstSeen < en.date && it.lastSeen > en.date) {
    //     //       aircraftGroupedData[aircraft].entryDates[index] = en
    //     //     }
    //     //   })
    //     // })
    //   }
    // })
    const result = []
    Object.keys(aircraftGroupedData).map(aircraft => {
      result.push({
        icao24: aircraft,
        callsign: aircraftGroupedData[aircraft].callsign,
        entryDate: aircraftGroupedData[aircraft].entryDates[0].date,
        origin_country: aircraftGroupedData[aircraft].origin_country,
        coordinates: aircraftGroupedData[aircraft].coordinates,
        lastHeading: aircraftGroupedData[aircraft].lastHeading,
        time_position: aircraftGroupedData[aircraft].entryDates[0].date
      })
    })
    return result
  }

  async createEntranceRecord(
    airspaceId: string,
    icao24: string,
    callsign: string,
    country: string,
    coordinates: [number, number]
  ) {
    const newRecord = new this.recordModel({
      icao24: icao24,
      airspace: airspaceId,
      callsign: callsign,
      origin_country: country,
      entryDate: new Date(),
      coordinates: [coordinates]
    })

    await newRecord.save()
    return newRecord
  }

  async createExitRecord(id: string, heading: number, coordinates: [[number, number]]) {
    const entranceRecord = await this.recordModel.findById(id)
    entranceRecord.coordinates = coordinates
    entranceRecord.lastHeading = heading
    entranceRecord.exitDate = new Date()
    await entranceRecord.save()
    return entranceRecord
  }

  groupAndCombineDatesWithCoordinates(array) {
    return array.reduce((result, item) => {
      const key = item.icao24
      if (!result[key]) {
        result[key] = {
          icao24: item.icao24,
          callsign: item.callsign,
          origin_country: item.origin_country,
          entryDates: [],
          exitDates: [],
          coordinates: [],
          lastHeading: item.lastHeading
        }
      }
      const lastCoordinate = item.coordinates ? item.coordinates[item.coordinates.length - 1] : null
      const entryUnixTimestamp = Math.floor(new Date(item.entryDate).getTime() / 1000)
      const exitUnixTimestamp = Math.floor(new Date(item.exitDate).getTime() / 1000)
      result[key].entryDates.push({ date: entryUnixTimestamp, coordinate: lastCoordinate })
      result[key].exitDates.push({ date: exitUnixTimestamp, coordinate: lastCoordinate })
      result[key].coordinates = [...result[key].coordinates, ...item.coordinates]
      return result
    }, {})
  }
}
