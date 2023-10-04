import { Module } from '@nestjs/common';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { PhotographersModule } from './photographers/photographers.module';
import { FilesModule } from './files/files.module';
import { CamerasModule } from './cameras/cameras.module';
//import appConfig from './config/app.config';
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: +process.env.DATABASE_PORT,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }),
    ItemsModule,
    PhotographersModule,
    FilesModule,
    CamerasModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
