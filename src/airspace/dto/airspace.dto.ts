import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class AirspaceDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsNumber()
  lat: number

  @IsNotEmpty()
  @IsNumber()
  lon: number

  @IsNotEmpty()
  @IsNumber()
  rad: number
}
