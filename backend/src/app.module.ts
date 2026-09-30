import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { EmployeesModule } from './modules/employees/employees.module';
import { MarketingModule } from './modules/marketing/marketing.module';
import { PortalModule } from './modules/portal/portal.module';
import { RadiusModule } from './modules/radius/radius.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],

      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: Number(configService.get<string>('DB_PORT')),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),

    EmployeesModule,
    MarketingModule,
    PortalModule,
    RadiusModule,
  ],

  controllers: [AppController],
  providers: [AppService],
})

export class AppModule {}
