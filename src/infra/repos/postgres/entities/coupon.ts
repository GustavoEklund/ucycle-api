import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PgOrder, PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'coupon' })
export class PgCoupon {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @Column({ name: 'code', type: 'varchar', nullable: false })
  code!: string

  @Column({ name: 'percentage', type: 'integer', nullable: false })
  percentage!: number

  @Column({ name: 'expire_date', type: 'timestamp' })
  expireDate!: Date

  @ManyToMany(() => PgOrder, (order) => order.items)
  orders!: Promise<PgOrder[]>

  @ManyToOne(() => PgUser, (user) => user.coupons, {
    nullable: true,
  })
  @JoinColumn({ name: 'user_id', referencedColumnName: 'id' })
  createdBy?: PgUser

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
