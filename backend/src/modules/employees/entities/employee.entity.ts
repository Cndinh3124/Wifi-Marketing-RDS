import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { WiFiDevice } from './wifi-device.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 20, unique: true })
  msnv: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 150, nullable: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => WiFiDevice, (device) => device.employee)
  devices: WiFiDevice[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}