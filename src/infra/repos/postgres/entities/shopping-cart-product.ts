import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PgProduct, PgShoppingCart } from '@/infra/repos/postgres/entities'

@Entity({ name: 'shopping_cart_product' })
export class PgShoppingCartProduct {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @ManyToOne(() => PgProduct, (product) => product.shoppingCartProducts)
  product!: PgProduct

  @ManyToOne(() => PgShoppingCart, (shoppingCart) => shoppingCart.shoppingCartProducts)
  shoppingCart!: PgShoppingCart

  @Column({ name: 'title', nullable: false })
  title!: string

  @Column({ name: 'amount', nullable: false })
  amount!: number

  @Column({ name: 'priceInCents', nullable: false })
  priceInCents!: number

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
