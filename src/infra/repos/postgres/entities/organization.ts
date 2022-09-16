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
  PgAddress,
  PgAdmissionProposal,
  PgImage,
  PgOrganizationMember,
  PgUser,
  PgUserPermission,
} from '@/infra/repos/postgres/entities'

@Entity({ name: 'organization' })
export class PgOrganization {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => PgAddress, (address) => address.organizations)
  @JoinColumn({ name: 'address_id', referencedColumnName: 'id' })
  address!: PgAddress

  @ManyToOne(() => PgUser, (user) => user.organizationsOwned)
  @JoinColumn({ name: 'owner_user_id', referencedColumnName: 'id' })
  ownerUser!: PgUser

  @OneToMany(() => PgImage, (image) => image.organization)
  pictures!: Promise<PgImage[]>

  @OneToMany(() => PgAdmissionProposal, (admissionProposal) => admissionProposal.organization)
  admissionProposals!: Promise<PgAdmissionProposal[]>

  @OneToMany(() => PgOrganizationMember, (organizationMember) => organizationMember.organization)
  members!: Promise<PgOrganizationMember[]>

  @ManyToOne(() => PgUserPermission, (userPermission) => userPermission.grantAtOrganization)
  @JoinColumn({ name: 'user_permission_id', referencedColumnName: 'id' })
  userPermissions!: Promise<PgUserPermission[]>

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
