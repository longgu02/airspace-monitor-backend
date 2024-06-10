import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class AirspaceDto {
  @IsNotEmpty()
  @IsString()
  name: string

  @IsNotEmpty()
  @IsNumber()
  latMin: number

  @IsNotEmpty()
  @IsNumber()
  lonMin: number

  @IsNotEmpty()
  @IsNumber()
  latMax: number

  @IsNotEmpty()
  @IsNumber()
  lonMax: number

  // @IsNotEmpty()
  // @IsNumber()
  // rad: number
}
