import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PgAddress, PgAdmissionProposal, PgImage, PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'organization' })
export class PgOrganization {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => PgAddress, (address) => address.organizations)
  address!: PgAddress

  @OneToMany(() => PgImage, (image) => image.organization)
  pictures!: Promise<PgImage[]>

  @OneToMany(() => PgAdmissionProposal, (admissionProposal) => admissionProposal.organization)
  admissionProposals!: Promise<PgAdmissionProposal[]>

  @ManyToMany(() => PgUser, (user) => user.organizations)
  @JoinTable({ name: 'organization_members' })
  members!: Promise<PgUser[]>

  @ManyToOne(() => PgUser, (user) => user.organizationsOwned)
  ownerUser!: PgUser

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
