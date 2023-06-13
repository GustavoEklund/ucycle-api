import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PgAddress, PgCoupon, PgOrderItem, PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'order' })
export class PgOrder {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @Column({ name: 'code', type: 'varchar', nullable: false })
  code!: string

  @OneToMany(() => PgOrderItem, (orderItem) => orderItem.order)
  items!: Promise<PgOrderItem[]>

  @ManyToMany(() => PgCoupon, (coupon) => coupon.orders)
  @JoinTable({
    name: 'order_coupon',
    joinColumn: {
      name: 'order_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'coupon_id',
      referencedColumnName: 'id',
    },
  })
  coupons!: Promise<PgCoupon[]>

  @Column({ name: 'shipping_price_in_cents', type: 'float', nullable: false })
  shippingPriceInCents!: number

  @Column({ name: 'estimated_delivery_date', type: 'date', nullable: false })
  estimatedDeliveryDate!: Date

  @ManyToOne(() => PgAddress, (address) => address.orders)
  @JoinColumn({ name: 'shipping_address_id', referencedColumnName: 'id' })
  shippingAddress!: PgAddress

  @Column({ name: 'status', type: 'varchar', nullable: false })
  status!: string

  @Column({ name: 'total_in_cents', type: 'float', nullable: false })
  totalInCents!: number

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
