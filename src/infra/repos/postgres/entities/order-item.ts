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
import { PgUser } from '@/infra/repos/postgres/entities/user'
import { PgOrder } from '@/infra/repos/postgres/entities/order'
import { PgProduct } from '@/infra/repos/postgres/entities/product'

@Entity({ name: 'order_item' })
export class PgOrderItem {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @ManyToOne(() => PgProduct, (product) => product.orderItems)
  @JoinColumn({ name: 'product_id', referencedColumnName: 'id' })
  product!: PgProduct

  @Column({ name: 'title', nullable: false })
  productTitle!: string

  @Column({ name: 'picture_url', nullable: false })
  pictureUrl!: string

  @Column({ name: 'amount', type: 'int', nullable: false })
  amount!: number

  @Column({ name: 'price_in_cents', type: 'int', nullable: false })
  priceInCents!: number

  @Column({ name: 'total_in_cents', type: 'int', nullable: false })
  totalInCents!: number

  @ManyToOne(() => PgOrder, (order) => order.items)
  @JoinColumn({ name: 'order_id', referencedColumnName: 'id' })
  order!: PgOrder

  @ManyToOne(() => PgUser, (user) => user.orderItems)
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
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
