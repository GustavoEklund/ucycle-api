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

import { PgProductCategory, PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'product' })
export class PgProduct {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @Column({ name: 'title', nullable: false })
  title!: string

  @Column({ name: 'description', type: 'text', nullable: true })
  description?: string

  @Column({ name: 'city', nullable: false })
  city!: string

  @Column({ name: 'picture_url', nullable: false })
  pictureUrl!: string

  @Column({ name: 'total_price_in_cents', nullable: false })
  totalPriceInCents!: number

  @Column({ name: 'total_discount_in_percentage', nullable: true })
  totalDiscountInPercentage!: number

  @ManyToMany(() => PgProductCategory, (productCategory) => productCategory.products)
  productCategories!: Promise<PgProductCategory[]>

  @ManyToOne(() => PgUser, (user) => user.products)
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
