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

import { PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'document' })
export class PgDocument {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @Column({ nullable: false })
  type!: string

  @Column({ nullable: false })
  number!: string

  @ManyToOne(() => PgUser, (user) => user.documents, { nullable: false })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  user!: PgUser

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
