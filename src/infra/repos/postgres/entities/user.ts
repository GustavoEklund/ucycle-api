import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import {
  PgAddress,
  PgAdmissionProposal,
  PgBasePermission,
  PgContact,
  PgCoupon,
  PgDocument,
  PgErrorLog,
  PgImage,
  PgModule,
  PgOrder,
  PgOrganization,
  PgOrganizationMember,
  PgProduct,
  PgProductCategory,
  PgShoppingCart,
} from '@/infra/repos/postgres/entities'
import { PgEmailTemplate } from '@/infra/repos/postgres/entities/email-template'

@Entity({ name: 'user' })
export class PgUser {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @Column({ name: 'first_name', nullable: false })
  firstName!: string

  @Column({ name: 'last_name', nullable: false })
  lastName!: string

  @Column({ name: 'first_access', type: 'boolean', default: true })
  firstAccess!: boolean

  @Column({ name: 'picture_url', nullable: true })
  pictureUrl?: string

  @Column({ nullable: true, length: 2 })
  initials?: string

  @OneToMany(() => PgDocument, (document) => document.user, { cascade: ['insert'] })
  documents!: Promise<PgDocument[]>

  @OneToMany(() => PgContact, (contact) => contact.user, { cascade: ['insert'] })
  contacts!: Promise<PgContact[]>

  @OneToMany(() => PgOrganization, (organization) => organization.ownerUser)
  organizationsOwned!: Promise<PgOrganization[]>

  @OneToMany(() => PgOrganizationMember, (organizationMember) => organizationMember.user)
  organizationsMember!: Promise<PgOrganizationMember[]>

  @OneToMany(() => PgAdmissionProposal, (admissionProposal) => admissionProposal.createdBy)
  admissionProposals!: Promise<PgAdmissionProposal[]>

  @OneToMany(() => PgBasePermission, (basePermission) => basePermission.createdBy)
  basePermissions!: Promise<PgBasePermission[]>

  @OneToMany(() => PgModule, (module) => module.createdBy)
  modules!: Promise<PgModule[]>

  @OneToMany(() => PgAddress, (address) => address.createdBy)
  addresses!: Promise<PgAddress[]>

  @OneToMany(() => PgImage, (image) => image.createdBy)
  images!: Promise<PgImage[]>

  @OneToMany(() => PgShoppingCart, (shoppingCart) => shoppingCart.createdBy)
  shoppingCarts!: Promise<PgShoppingCart[]>

  @OneToMany(() => PgProduct, (products) => products.createdBy)
  products!: Promise<PgProduct[]>

  @OneToMany(() => PgProductCategory, (productCategory) => productCategory.createdBy)
  productCategories!: Promise<PgProductCategory[]>

  @OneToMany(() => PgCoupon, (coupon) => coupon.createdBy)
  coupons!: Promise<PgOrder[]>

  @OneToMany(() => PgOrder, (order) => order.createdBy)
  orders!: Promise<PgOrder[]>

  @OneToMany(() => PgEmailTemplate, (emailTemplate) => emailTemplate.createdBy)
  emailTemplates!: Promise<PgEmailTemplate[]>

  @OneToMany(() => PgErrorLog, (errorLog) => errorLog.createdBy)
  errorLogs!: Promise<PgErrorLog[]>

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
