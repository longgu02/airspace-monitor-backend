import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ADSBModule } from './adsb/adsb.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule } from '@nestjs/config'

// , MongooseModule.forRoot(process.env.MONGO_URI)
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ADSBModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
