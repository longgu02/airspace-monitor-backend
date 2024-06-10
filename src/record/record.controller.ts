import { Controller, Get, Query } from '@nestjs/common'
import { RecordService } from './record.service'

@Controller('/api/v1/record')
export class RecordController {
  constructor(private readonly recordService: RecordService) {}
  @Get('/')
  async getRecords(@Query('airspace') airspaceId, @Query('from') from: number, @Query('to') to: number) {
    const records = await this.recordService.getRecords(airspaceId, Number(from), Number(to))
    return records
  }
}
