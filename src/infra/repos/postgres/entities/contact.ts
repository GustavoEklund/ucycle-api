import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'contact' })
export class PgContact {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'boolean', default: false })
  verified!: boolean

  @Column({ nullable: false })
  type!: string

  @Column({ nullable: false })
  label!: string

  @Column({ type: 'varchar', nullable: false })
  value!: string

  @ManyToOne(() => PgUser, (user) => user.contacts, {
    cascade: ['insert'],
    nullable: false,
  })
  user!: Promise<PgUser>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
