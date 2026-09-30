import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Employee } from './entities/employee.entity';
import { WiFiDevice } from './entities/wifi-device.entity';
import { WiFiSession } from './entities/wifi-session.entity';

@Injectable()
export class EmployeesService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,

    @InjectRepository(WiFiDevice)
    private readonly wifiDeviceRepository: Repository<WiFiDevice>,

    @InjectRepository(WiFiSession)
    private readonly wifiSessionRepository: Repository<WiFiSession>,
  ) {}

  // =========================
  // EMPLOYEE
  // =========================

  async findByMsnv(
    msnv: string,
  ): Promise<Employee | null> {
    return this.employeeRepository.findOne({
      where: { msnv },
      relations: ['devices'],
    });
  }

  async create(data: {
    msnv: string;
    name: string;
    email?: string;
  }): Promise<Employee> {
    const employee =
      this.employeeRepository.create(data);

    return this.employeeRepository.save(employee);
  }

  // =========================
  // DEVICE
  // =========================

  async findDeviceByMac(
    macAddress: string,
  ): Promise<WiFiDevice | null> {
    return this.wifiDeviceRepository.findOne({
      where: { macAddress },
      relations: ['employee'],
    });
  }

  async findDevicesByMsnv(
    msnv: string,
  ): Promise<WiFiDevice[]> {
    return this.wifiDeviceRepository.find({
      where: {
        employee: {
          msnv: msnv,
        },
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async addDevice(
    employee: Employee,
    data: {
      macAddress: string;
      deviceName?: string;
    },
  ): Promise<WiFiDevice> {
    const device =
      this.wifiDeviceRepository.create({
        macAddress: data.macAddress,
        deviceName: data.deviceName,
        employee,
      });

    return this.wifiDeviceRepository.save(device);
  }

  async disableDevice(
    deviceId: string,
  ): Promise<WiFiDevice | null> {
    const device =
      await this.wifiDeviceRepository.findOne({
        where: {
          id: deviceId,
        },
      });

    if (!device) {
      return null;
    }

    device.isActive = false;

    await this.wifiDeviceRepository.save(device);

    // Revoke active session
    const activeSession =
      await this.findActiveSessionByDevice(
        deviceId,
      );

    if (activeSession) {
      activeSession.isActive = false;
      activeSession.endedAt = new Date();

      await this.wifiSessionRepository.save(
        activeSession,
      );
    }

    return device;
  }

  async enableDevice(
    deviceId: string,
  ): Promise<WiFiDevice | null> {
    const device =
      await this.wifiDeviceRepository.findOne({
        where: {
          id: deviceId,
        },
      });

    if (!device) {
      return null;
    }

    device.isActive = true;

    return this.wifiDeviceRepository.save(device);
  }

  // =========================
  // WIFI SESSION
  // =========================
  async findSessionsByMsnv(
    msnv: string,
  ): Promise<WiFiSession[]> {
    return this.wifiSessionRepository.find({
      where: {
        device: {
          employee: {
            msnv,
          },
        },
      },
      relations: [
        'device',
        'device.employee',
      ],
      order: {
        createdAt: 'DESC',
      },
    });
  }
  async createSession(
    device: WiFiDevice,
    durationMinutes = 480,
  ): Promise<WiFiSession> {
    const startedAt = new Date();

    const expiresAt = new Date(
      startedAt.getTime() +
        durationMinutes * 60 * 1000,
    );

    const session =
      this.wifiSessionRepository.create({
        device,
        startedAt,
        expiresAt,
        isActive: true,
        endedAt: null,
      });

    return this.wifiSessionRepository.save(
      session,
    );
  }

  async findSessionById(
    sessionId: string,
  ): Promise<WiFiSession | null> {
    return this.wifiSessionRepository.findOne({
      where: {
        id: sessionId,
      },
      relations: [
        'device',
        'device.employee',
      ],
    });
  }

  async endSession(
    sessionId: string,
  ): Promise<WiFiSession | null> {
    const session =
      await this.wifiSessionRepository.findOne({
        where: {
          id: sessionId,
        },
      });

    if (!session) {
      return null;
    }

    session.isActive = false;
    session.endedAt = new Date();

    return this.wifiSessionRepository.save(
      session,
    );
  }

  async expireSessionIfNeeded(
    session: WiFiSession,
  ): Promise<WiFiSession> {
    const now = new Date();

    if (
      session.isActive &&
      now >= session.expiresAt
    ) {
      session.isActive = false;
      session.endedAt = now;

      return this.wifiSessionRepository.save(
        session,
      );
    }

    return session;
  }

  async findActiveSessionByDevice(
    deviceId: string,
  ): Promise<WiFiSession | null> {
    const session =
      await this.wifiSessionRepository.findOne({
        where: {
          device: {
            id: deviceId,
          },
          isActive: true,
        },
        relations: [
          'device',
          'device.employee',
        ],
      });

    if (!session) {
      return null;
    }

    const now = new Date();

    if (now >= session.expiresAt) {
      session.isActive = false;
      session.endedAt = now;

      await this.wifiSessionRepository.save(
        session,
      );

      return null;
    }

    return session;
  }

  async checkSessionAccess(
    sessionId: string,
  ): Promise<WiFiSession | null> {
    const session =
      await this.findSessionById(sessionId);

    if (!session) {
      return null;
    }

    const now = new Date();

    if (
      session.isActive &&
      now >= session.expiresAt
    ) {
      return this.expireSessionIfNeeded(
        session,
      );
    }

    return session;
  }
}