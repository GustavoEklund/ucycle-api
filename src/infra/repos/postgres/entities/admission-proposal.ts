import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PgOrganization, PgUser } from '@/infra/repos/postgres/entities'

export enum PgAdmissionProposalStatus {
  pending = 'PENDING',
  accepted = 'ACCEPTED',
  rejected = 'REJECTED',
}

@Entity({ name: 'admission_proposal' })
export class PgAdmissionProposal {
  @PrimaryGeneratedColumn('uuid', { comment: 'uuid primary key' })
  id!: string

  @Column({ name: 'status', type: 'enum', enum: PgAdmissionProposalStatus, nullable: false })
  status!: PgAdmissionProposalStatus

  @ManyToOne(() => PgOrganization, (organization) => organization.admissionProposals)
  @JoinColumn({ name: 'organization_id', referencedColumnName: 'id' })
  organization!: PgOrganization

  @ManyToOne(() => PgUser, (user) => user.admissionProposals)
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
