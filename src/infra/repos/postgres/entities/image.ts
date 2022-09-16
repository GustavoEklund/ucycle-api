import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PgOrganization, PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'image' })
export class PgImage {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @Column()
  url!: string

  @ManyToOne(() => PgOrganization, (organization) => organization.pictures)
  @JoinColumn({ name: 'organization_id', referencedColumnName: 'id' })
  organization!: PgOrganization

  @ManyToOne(() => PgUser, (user) => user.images)
  @JoinColumn({ name: 'created_by' })
  createdBy!: PgUser

  @CreateDateColumn({
    name: 'created_at',
    comment: 'the date and time when the permission was created',
  })
  createdAt!: Date

  @UpdateDateColumn({
    name: 'updated_at',
    comment: 'the date when the permission was updated last time',
  })
  updatedAt!: Date

  @DeleteDateColumn({
    name: 'deleted_at',
    comment: 'the date when the permission was deleted, null if not deleted',
  })
  deletedAt?: Date
}
