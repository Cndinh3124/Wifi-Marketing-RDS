import {
  Body,
  Controller,
  Get,
  Param,
  Post,
} from '@nestjs/common';

import { EmployeesService } from './employees.service';

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
  ) {}

  @Get('msnv/:msnv')
  async findByMsnv(@Param('msnv') msnv: string) {
    const employee =
      await this.employeesService.findByMsnv(msnv);

    if (!employee) {
      return {
        success: false,
        message: 'Không tìm thấy nhân viên',
      };
    }

    return {
      success: true,
      data: employee,
    };
  }

  @Post(':msnv/devices')
  async addDevice(
    @Param('msnv') msnv: string,
    @Body()
    body: {
      macAddress: string;
      deviceName?: string;
    },
  ) {
    const employee =
      await this.employeesService.findByMsnv(msnv);

    if (!employee) {
      return {
        success: false,
        message: 'Không tìm thấy nhân viên',
      };
    }

    const existingDevice =
      await this.employeesService.findDeviceByMac(
        body.macAddress,
      );

    if (existingDevice) {
      return {
        success: false,
        message: 'MAC Address đã được đăng ký',
      };
    }

    const device =
      await this.employeesService.addDevice(
        employee,
        {
          macAddress: body.macAddress,
          deviceName: body.deviceName,
        },
      );

    return {
      success: true,
      message: 'Đăng ký thiết bị thành công',
      data: {
        id: device.id,
        macAddress: device.macAddress,
        deviceName: device.deviceName,
        isActive: device.isActive,
      },
    };
  }

  @Post()
  async create(
    @Body()
    body: {
      msnv: string;
      name: string;
      email?: string;
    },
  ) {
    const employee =
      await this.employeesService.create(body);

    return {
      success: true,
      message: 'Tạo nhân viên thành công',
      data: employee,
    };
  }
}