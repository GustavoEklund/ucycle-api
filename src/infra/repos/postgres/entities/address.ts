import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PgUser } from './user'
import { PgOrganization } from '@/infra/repos/postgres/entities/organization'

@Entity({ name: 'address' })
export class PgAddress {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  state!: string

  @Column()
  city!: string

  @Column()
  neighbourhood!: string

  @Column()
  street!: string

  @Column()
  buildingNumber!: number

  @Column()
  postalCode!: string

  @Column()
  country!: string

  @OneToMany(() => PgOrganization, (organization) => organization.address)
  organizations!: Promise<PgOrganization[]>

  @ManyToOne(() => PgUser, (user) => user.organizations)
  createdBy!: PgUser

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
