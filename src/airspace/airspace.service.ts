import { Injectable } from '@nestjs/common'
import { Model } from 'mongoose'
import { Airspace } from './schema/airspace.schema'
import { InjectModel } from '@nestjs/mongoose'

@Injectable()
export class AirspaceService {
  constructor(@InjectModel(Airspace.name) private airspaceModel: Model<Airspace>) {}
  async createAirspace(name: string, lat: number, lon: number, rad: number) {
    // if(type == "circle" && coordinates.length == 1){
    //   const newAirspace = new this.airspaceModel({
    //     name: name,
    //     coordinates: coordinates,
    //     type: "circle"
    //   })
    // }

    const newAirspace = new this.airspaceModel({
      name: name,
      lat: lat,
      lon: lon,
      rad: rad
    })

    await newAirspace.save()
    return newAirspace
  }

  async getAirspace(id: string) {
    const matchedAirspace = await this.airspaceModel.findById(id)
    return matchedAirspace
  }
}
