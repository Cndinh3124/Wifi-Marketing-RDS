import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Employee } from './employee.entity';
import { WiFiSession } from './wifi-session.entity';

@Entity('wifi_devices')
export class WiFiDevice {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 17, unique: true })
  macAddress: string;

  @Column({ length: 100, nullable: true })
  deviceName: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Employee, (employee) => employee.devices, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @OneToMany(
    () => WiFiSession,
    (session) => session.device,
  )
  sessions: WiFiSession[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}