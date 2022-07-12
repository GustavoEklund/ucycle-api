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

import { PgModule, PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'base_permission' })
export class PgBasePermission {
  @PrimaryGeneratedColumn('uuid', {
    name: 'id',
    comment: 'the base permission id, in uuid format',
  })
  id!: string

  @Column('varchar', {
    length: 100,
    name: 'code',
    unique: true,
    nullable: false,
    comment: 'the unique code to identify the permission',
  })
  code!: string

  @Column('varchar', {
    name: 'name',
    length: 256,
    nullable: false,
    comment: 'the name of the permission',
  })
  name!: string

  @Column('varchar', {
    name: 'description',
    length: 256,
    nullable: true,
    comment: 'the description of the permission',
  })
  description?: string

  @Column('boolean', {
    name: 'read',
    default: false,
    nullable: false,
    comment: 'if has read permission',
  })
  read!: boolean

  @Column('boolean', {
    name: 'write',
    default: false,
    nullable: false,
    comment: 'if has write permission',
  })
  write!: boolean

  @Column('boolean', {
    name: 'owner',
    default: false,
    nullable: false,
    comment: 'if has owner permission',
  })
  owner!: boolean

  @ManyToOne(() => PgModule, (module) => module.basePermissions, { nullable: false })
  @JoinColumn({ name: 'module_id', referencedColumnName: 'id' })
  module!: PgModule

  @Column('enum', {
    enum: ['GRANTED', 'REVOKED'],
    name: 'status',
    nullable: false,
    comment: 'the permission status can be either GRANTED or REVOKED',
  })
  status!: string

  @ManyToOne(() => PgUser, (user) => user.basePermissions, { nullable: true })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy?: PgUser

  @Column('timestamp', {
    name: 'expires_at',
    nullable: true,
    comment: 'the date when the permission expires',
  })
  expiresAt?: Date

  @CreateDateColumn({
    name: 'created_at',
    comment: 'the date when the permission was created',
  })
  createdAt!: Date

  @UpdateDateColumn({
    name: 'updated_at',
    comment: 'the date when the permission was updated last time',
  })
  updatedAt!: Date

  @DeleteDateColumn({
    name: 'deleted_at',
    comment: 'the date when the permission was deleted',
  })
  deletedAt!: Date
}
