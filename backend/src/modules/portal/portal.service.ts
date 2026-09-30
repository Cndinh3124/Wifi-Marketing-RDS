import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { EmployeesService } from '../employees/employees.service';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { AuthenticateEmployeeDto } from './dto/authenticate-employee.dto';

@Injectable()
export class PortalService {
  constructor(
    private readonly employeesService: EmployeesService,
  ) {}

  async register(dto: RegisterEmployeeDto) {
    const employeeByMsnv =
      await this.employeesService.findByMsnv(dto.msnv);

    if (employeeByMsnv) {
      throw new ConflictException(
        'MSNV này đã được đăng ký WiFi',
      );
    }

    const deviceByMac =
      await this.employeesService.findDeviceByMac(
        dto.macAddress,
      );

    if (deviceByMac) {
      throw new ConflictException(
        'Thiết bị này đã được đăng ký WiFi',
      );
    }

    const employee = await this.employeesService.create({
      msnv: dto.msnv,
      name: dto.name,
      email: dto.email,
    });

    const device =
      await this.employeesService.addDevice(
        employee,
        {
          macAddress: dto.macAddress,
        },
      );

    return {
      success: true,
      message: 'Đăng ký WiFi thành công',
      data: {
        employeeId: employee.id,
        msnv: employee.msnv,
        name: employee.name,
        email: employee.email,
        deviceId: device.id,
        macAddress: device.macAddress,
      },
    };
  }

  async authenticate(
    dto: AuthenticateEmployeeDto,
  ) {
    const employee =
      await this.employeesService.findByMsnv(
        dto.msnv,
      );

    if (!employee) {
      throw new UnauthorizedException(
        'MSNV không tồn tại',
      );
    }

    if (!employee.isActive) {
      throw new UnauthorizedException(
        'Tài khoản nhân viên đã bị vô hiệu hóa',
      );
    }

    const device =
      employee.devices?.find(
        (item) =>
          item.macAddress.toUpperCase() ===
            dto.macAddress.toUpperCase() &&
          item.isActive,
      );

    if (!device) {
      throw new UnauthorizedException(
        'Thiết bị chưa được đăng ký cho nhân viên này',
      );
    }

    let session =
      await this.employeesService.findActiveSessionByDevice(
        device.id,
      );

    if (!session) {
      session =
        await this.employeesService.createSession(
          device,
        );
    }
    return {
      success: true,
      message: 'Xác thực WiFi thành công',
      data: {
        employeeId: employee.id,
        msnv: employee.msnv,
        name: employee.name,
        deviceId: device.id,
        macAddress: device.macAddress,
        sessionId: session.id,
        startedAt: session.startedAt,
        expiresAt: session.expiresAt,
        accessGranted: true,
      },
    };
  }

  
}