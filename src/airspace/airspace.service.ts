import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { Airspace } from './schema/airspace.schema'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class AirspaceService {
  constructor(@InjectModel(Airspace.name) private airspaceModel: Model<Airspace>) {}

  async getAllAirspace() {
    const airspaces = await this.airspaceModel.find({})
    return airspaces
  }

  async createAirspace(name: string, latMin: number, lonMin: number, latMax: number, lonMax: number) {
    // if(type == "circle" && coordinates.length == 1){
    //   const newAirspace = new this.airspaceModel({
    //     name: name,
    //     coordinates: coordinates,
    //     type: "circle"
    //   })
    // }

    const newAirspace = new this.airspaceModel({
      name: name,
      latMin: latMin,
      lonMin: lonMin,
      latMax: latMax,
      lonMax: lonMax
      // rad: rad
    })

    await newAirspace.save()
    return newAirspace
  }

  async getAirspace(id: string) {
    const matchedAirspace = await this.airspaceModel.findById(id)
    return matchedAirspace
  }
}
