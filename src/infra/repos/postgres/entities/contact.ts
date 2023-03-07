import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PgAddress, PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'contact' })
export class PgContact {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @Column({ type: 'boolean', default: false })
  verified!: boolean

  @Column({ type: 'boolean', default: false, name: 'is_private' })
  isPrivate!: boolean

  @Column({ nullable: false })
  type!: string

  @Column({ nullable: false })
  label!: string

  @Column({ type: 'varchar', nullable: false })
  value!: string

  @OneToMany(() => PgAddress, (address) => address.phoneContact, {
    nullable: true,
  })
  addresses?: Promise<PgAddress[]>

  @ManyToOne(() => PgUser, (user) => user.contacts, {
    cascade: ['insert'],
    nullable: false,
  })
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
