import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Record, RecordSchema } from './schema/record.schema'
import { RecordController } from './record.controller'
import { RecordService } from './record.service'

@Module({
  imports: [MongooseModule.forFeature([{ name: Record.name, schema: RecordSchema }])],
  controllers: [RecordController],
  providers: [RecordService],
  exports: [RecordService]
})
export class RecordModule {}
