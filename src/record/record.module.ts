import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Record } from './schema/record.schema'
import { RecordController } from './record.controller'
import { RecordService } from './record.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Record.name, schema: Record }])],
  controllers: [RecordController],
  providers: [RecordService],
  exports: []
})
export class RecordModule {}
