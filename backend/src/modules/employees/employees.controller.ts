import { EmployeesService } from './employees.service';

import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';

@Controller('employees')
export class EmployeesController {
  constructor(
    private readonly employeesService: EmployeesService,
  ) {}

  // =========================
  // EMPLOYEE
  // =========================

  @Get('msnv/:msnv')
  async findByMsnv(
    @Param('msnv') msnv: string,
  ) {
    const employee =
      await this.employeesService.findByMsnv(
        msnv,
      );

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

  // =========================
  // DEVICE
  // =========================

  @Get(':msnv/devices')
  async findDevicesByMsnv(
    @Param('msnv') msnv: string,
  ) {
    const employee =
      await this.employeesService.findByMsnv(
        msnv,
      );

    if (!employee) {
      return {
        success: false,
        message: 'Không tìm thấy nhân viên',
      };
    }

    const devices =
      await this.employeesService.findDevicesByMsnv(
        msnv,
      );

    return {
      success: true,
      data: devices,
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
      await this.employeesService.findByMsnv(
        msnv,
      );

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

  @Patch('devices/:deviceId/disable')
  async disableDevice(
    @Param('deviceId') deviceId: string,
  ) {
    const device =
      await this.employeesService.disableDevice(
        deviceId,
      );

    if (!device) {
      return {
        success: false,
        message: 'Không tìm thấy thiết bị',
      };
    }

    return {
      success: true,
      message: 'Đã khóa thiết bị',
      data: {
        id: device.id,
        macAddress: device.macAddress,
        isActive: device.isActive,
      },
    };
  }

  @Patch('devices/:deviceId/enable')
  async enableDevice(
    @Param('deviceId') deviceId: string,
  ) {
    const device =
      await this.employeesService.enableDevice(
        deviceId,
      );

    if (!device) {
      return {
        success: false,
        message: 'Không tìm thấy thiết bị',
      };
    }

    return {
      success: true,
      message: 'Đã mở khóa thiết bị',
      data: {
        id: device.id,
        macAddress: device.macAddress,
        isActive: device.isActive,
      },
    };
  }

    @Get(':msnv/sessions')
    async findSessionsByMsnv(
        @Param('msnv') msnv: string,
    ) {
        const employee =
            await this.employeesService.findByMsnv(
                msnv,
            );

        if (!employee) {
            return {
                success: false,
                message: 'Không tìm thấy nhân viên',
            };
        }

        const sessions =
            await this.employeesService.findSessionsByMsnv(
                msnv,
            );

        return {
            success: true,
            data: sessions,
        };
    }
}