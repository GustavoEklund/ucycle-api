import {
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PgBasePermission, PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'module' })
export class PgModule {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @OneToMany(() => PgBasePermission, (basePermission) => basePermission.module)
  basePermissions!: Promise<PgBasePermission[]>

  @ManyToOne(() => PgUser, (user) => user.modules)
  createdBy!: PgUser

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
