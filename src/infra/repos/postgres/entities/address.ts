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

import { PgOrganization, PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'address' })
export class PgAddress {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @Column({ name: 'country', nullable: false })
  country!: string

  @Column({ name: 'street_name', nullable: false })
  state!: string

  @Column({ name: 'city', nullable: false })
  city!: string

  @Column({ name: 'neighbourhood', nullable: false })
  neighbourhood!: string

  @Column({ name: 'street', nullable: false })
  street!: string

  @Column({ name: 'building_number', nullable: true })
  buildingNumber?: string

  @Column({ name: 'zip_code', type: 'varchar', length: 8, nullable: false })
  zipCode!: string

  @OneToMany(() => PgOrganization, (organization) => organization.address)
  @JoinColumn({ name: 'organization_id', referencedColumnName: 'id' })
  organizations!: Promise<PgOrganization[]>

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
