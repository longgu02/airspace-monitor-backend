import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { ADSBModule } from './adsb/adsb.module'
import { MongooseModule } from '@nestjs/mongoose'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { AirspaceModule } from './airspace/airspace.module'
import { ScheduleModule } from '@nestjs/schedule'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    // ConfigModule.forRoot({
    //   envFilePath: '.env'
    // }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    // MongooseModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get<string>('MONGO_URI')
    //   }),
    //   inject: [ConfigService]
    // }),
    ADSBModule,
    AirspaceModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
