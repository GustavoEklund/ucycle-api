import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PgOrganization, PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'admission_proposal' })
export class PgAdmissionProposal {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  status!: string

  @ManyToOne(() => PgOrganization, (organization) => organization.admissionProposals)
  organization!: PgOrganization

  @ManyToOne(() => PgUser, (user) => user.organizations)
  createdBy!: PgUser

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
