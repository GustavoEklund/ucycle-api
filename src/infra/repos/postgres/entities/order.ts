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

import { PgCoupon, PgProduct, PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'order' })
export class PgOrder {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @Column({ name: 'code', type: 'varchar', nullable: false })
  code!: string

  @ManyToMany(() => PgProduct, (product) => product.orders)
  items!: Promise<PgProduct[]>

  @ManyToMany(() => PgCoupon, (coupon) => coupon.orders)
  @JoinColumn()
  coupons!: Promise<PgCoupon[]>

  @Column({ name: 'freight', type: 'float', nullable: false })
  freight!: number

  @ManyToOne(() => PgUser, (user) => user.orders)
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
