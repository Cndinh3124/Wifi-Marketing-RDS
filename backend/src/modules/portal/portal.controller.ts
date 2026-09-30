import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UnauthorizedException,
} from '@nestjs/common';

import { PortalService } from './portal.service';
import { RegisterEmployeeDto } from './dto/register-employee.dto';
import { AuthenticateEmployeeDto } from './dto/authenticate-employee.dto';
import { EmployeesService } from '../employees/employees.service';

@Controller('portal')
export class PortalController {
  constructor(
    private readonly portalService: PortalService,
    private readonly employeesService: EmployeesService,
  ) {}

  @Post('register')
  async register(@Body() dto: RegisterEmployeeDto) {
    return this.portalService.register(dto);
  }

  @Post('authenticate')
  async authenticate(
    @Body() dto: AuthenticateEmployeeDto,
  ) {
    return this.portalService.authenticate(dto);
  }

  @Get('session/:sessionId')
  async checkSession(
    @Param('sessionId') sessionId: string,
  ) {
    const session =
      await this.employeesService.findSessionById(
        sessionId,
      );

    if (!session) {
      throw new UnauthorizedException(
        'Session không tồn tại',
      );
    }

    const now = new Date();

    const expired =
      now >= session.expiresAt;

    if (expired && session.isActive) {
      await this.employeesService.expireSessionIfNeeded(
        session,
      );
    }

    return {
      success: true,
      data: {
        sessionId: session.id,
        msnv: session.device.employee.msnv,
        name: session.device.employee.name,
        deviceId: session.device.id,
        macAddress: session.device.macAddress,
        isActive: session.isActive && !expired,
        expired,
        startedAt: session.startedAt,
        expiresAt: session.expiresAt,
      },
    };
  }

  @Get('access/:sessionId')
  async checkAccess(
    @Param('sessionId') sessionId: string,
  ) {
    const session =
      await this.employeesService.checkSessionAccess(
        sessionId,
      );

    if (!session) {
      throw new UnauthorizedException(
        'Session không tồn tại',
      );
    }

    const now = new Date();

    const accessGranted =
      session.isActive &&
      now < session.expiresAt &&
      session.device.isActive &&
      session.device.employee.isActive;

    if (!accessGranted) {
      return {
        success: true,
        accessGranted: false,
        reason: 'SESSION_INACTIVE',
        data: {
          sessionId: session.id,
          msnv: session.device.employee.msnv,
          name: session.device.employee.name,
          macAddress: session.device.macAddress,
          expiresAt: session.expiresAt,
        },
      };
    }

    return {
      success: true,
      accessGranted: true,
      reason: 'ACTIVE_SESSION',
      data: {
        sessionId: session.id,
        msnv: session.device.employee.msnv,
        name: session.device.employee.name,
        macAddress: session.device.macAddress,
        expiresAt: session.expiresAt,
      },
    };
  }

  @Post('session/:sessionId/logout')
  async logout(
    @Param('sessionId') sessionId: string,
  ) {
    const session =
      await this.employeesService.endSession(
        sessionId,
      );

    if (!session) {
      throw new UnauthorizedException(
        'Session không tồn tại',
      );
    }

    return {
      success: true,
      message: 'Đã kết thúc phiên WiFi',
      data: {
        sessionId: session.id,
        isActive: session.isActive,
        endedAt: session.endedAt,
      },
    };
  }
}