import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import {
  PgBasePermission,
  PgContact,
  PgDocument,
  PgModule,
  PgOrganization,
} from '@/infra/repos/postgres/entities'

@Entity({ name: 'user' })
export class PgUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ nullable: false })
  firstName!: string

  @Column({ nullable: false })
  lastName!: string

  @Column({ type: 'boolean', default: false })
  firstAccess!: boolean

  @Column({ nullable: true })
  pictureUrl?: string

  @Column({ nullable: true })
  initials?: string

  @OneToMany(() => PgDocument, (document) => document.user, { cascade: ['insert'] })
  documents!: Promise<PgDocument[]>

  @OneToMany(() => PgContact, (contact) => contact.user, { cascade: ['insert'] })
  contacts!: Promise<PgContact[]>

  @OneToMany(() => PgOrganization, (organization) => organization.ownerUser)
  organizationsOwned!: Promise<PgOrganization[]>

  @ManyToMany(() => PgOrganization, (organization) => organization.members)
  organizations!: Promise<PgOrganization[]>

  @OneToMany(() => PgBasePermission, (basePermission) => basePermission.createdBy)
  basePermissions!: Promise<PgBasePermission[]>

  @OneToMany(() => PgModule, (module) => module.createdBy)
  modules!: Promise<PgModule[]>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
