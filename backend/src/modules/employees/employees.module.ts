import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { Employee } from './entities/employee.entity';
import { WiFiDevice } from './entities/wifi-device.entity';
import { WiFiSession } from './entities/wifi-session.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Employee,
      WiFiDevice,
      WiFiSession,
    ]),
  ],
  controllers: [EmployeesController],
  providers: [EmployeesService],
  exports: [EmployeesService],
})
export class EmployeesModule {}