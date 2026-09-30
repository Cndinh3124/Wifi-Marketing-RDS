import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { WiFiDevice } from './wifi-device.entity';

@Entity('wifi_sessions')
export class WiFiSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => WiFiDevice, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'device_id' })
  device: WiFiDevice;

  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  endedAt: Date | null;

  @CreateDateColumn()
  createdAt: Date;
}