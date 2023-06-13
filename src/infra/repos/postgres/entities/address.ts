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

import { PgContact, PgOrder, PgOrganization, PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'address' })
export class PgAddress {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @Column({ name: 'country', type: 'varchar', nullable: false })
  country!: string

  @Column({ name: 'state', type: 'varchar', nullable: false })
  state!: string

  @Column({ name: 'city', type: 'varchar', nullable: false })
  city!: string

  @Column({ name: 'neighbourhood', type: 'varchar', nullable: false })
  neighbourhood!: string

  @Column({ name: 'street', type: 'varchar', nullable: false })
  street!: string

  @Column({ name: 'building_number', type: 'varchar', nullable: true })
  buildingNumber?: string

  @Column({ name: 'landmark', type: 'varchar', nullable: true })
  landmark?: string

  @Column({ name: 'type', type: 'varchar', nullable: false })
  type!: string

  @Column({ name: 'zip_code', type: 'varchar', length: 8, nullable: false })
  zipCode!: string

  @Column({ name: 'is_default', type: 'boolean', nullable: false })
  isDefault!: boolean

  @ManyToOne(() => PgContact, (phoneContact) => phoneContact.addresses, {
    nullable: true,
  })
  @JoinColumn({ name: 'phone_contact_id', referencedColumnName: 'id' })
  phoneContact?: PgContact

  @OneToMany(() => PgOrganization, (organization) => organization.address)
  organizations!: Promise<PgOrganization[]>

  @OneToMany(() => PgOrder, (order) => order.shippingAddress)
  orders!: Promise<PgOrder[]>

  @ManyToOne(() => PgUser, (user) => user.addresses)
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
