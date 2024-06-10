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

    return matchedRecords
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
}
