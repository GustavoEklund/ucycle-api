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

import { PgProduct, PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'product_category' })
export class PgProductCategory {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @Column({
    type: 'varchar',
    length: 32,
    unique: true,
    comment: 'unique identification for product category as a code',
  })
  code!: string

  @Column({
    name: 'name',
    nullable: false,
    comment: 'displayable name',
  })
  name!: string

  @Column({
    name: 'description',
    nullable: true,
    comment: 'displayable comment',
  })
  description?: string

  @OneToMany(() => PgProduct, (product) => product.category)
  products!: Promise<PgProduct[]>

  @ManyToOne(() => PgProductCategory, (productCategory) => productCategory.childCategories, {
    nullable: true,
  })
  parentCategory?: PgProductCategory

  @OneToMany(() => PgProductCategory, (productCategory) => productCategory.parentCategory)
  childCategories!: Promise<PgProductCategory[]>

  @ManyToOne(() => PgUser, (user) => user.productCategories)
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
