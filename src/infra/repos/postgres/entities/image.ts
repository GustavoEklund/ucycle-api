import { PgOrganization, PgUser } from '@/infra/repos/postgres/entities'

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'image' })
export class PgImage {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  url!: string

  @ManyToOne(() => PgOrganization, (organization) => organization.pictures)
  organization!: PgOrganization

  @ManyToOne(() => PgUser, (user) => user.organizations)
  createdBy!: PgUser

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
