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

import {
  PgImage,
  PgOrderItem,
  PgProductCategory,
  PgShoppingCartProduct,
  PgUser,
} from '@/infra/repos/postgres/entities'
import {
  ProductCondition,
  ProductWarrantyDurationUnit,
  ProductWarrantyType,
} from '@/domain/entities/product'

@Entity({ name: 'product' })
export class PgProduct {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @Column({ name: 'title', nullable: false })
  title!: string

  @Column({ name: 'description', type: 'text', nullable: false })
  description!: string

  @Column({ name: 'total_price_in_cents', nullable: false })
  totalPriceInCents!: number

  @Column({ name: 'total_discount_in_percentage', nullable: true })
  totalDiscountInPercentage!: number

  @Column({ name: 'condition', type: 'enum', enum: ProductCondition, nullable: false })
  condition!: ProductCondition

  @Column({ name: 'warranty_duration_time', type: 'integer', nullable: false })
  warrantyDurationTime!: number

  @Column({
    name: 'warranty_duration_unit',
    type: 'enum',
    enum: ProductWarrantyDurationUnit,
    nullable: false,
  })
  warrantyDurationUnit!: ProductWarrantyDurationUnit

  @Column({ name: 'warranty_type', type: 'enum', enum: ProductWarrantyType, nullable: false })
  warrantyType!: ProductWarrantyType

  @OneToMany(() => PgImage, (picture) => picture.product, {
    nullable: false,
    cascade: true,
  })
  pictures!: Promise<PgImage[]>

  @ManyToOne(() => PgProductCategory, (productCategory) => productCategory.products, {
    nullable: false,
  })
  @JoinColumn({ name: 'category_id', referencedColumnName: 'id' })
  category!: PgProductCategory

  @OneToMany(() => PgShoppingCartProduct, (shoppingCartProduct) => shoppingCartProduct.product)
  shoppingCartProducts!: Promise<PgShoppingCartProduct[]>

  @OneToMany(() => PgOrderItem, (orderItem) => orderItem.product)
  orderItems!: Promise<PgOrderItem[]>

  @ManyToOne(() => PgUser, (user) => user.products, {
    nullable: false,
  })
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
