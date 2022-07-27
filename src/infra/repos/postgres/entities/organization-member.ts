import { Column, Entity, JoinColumn, ManyToOne, OneToOne } from 'typeorm'

import {
  PgAdmissionProposal,
  PgBaseEntity,
  PgOrganization,
  PgUser,
} from '@/infra/repos/postgres/entities'

@Entity({ name: 'organization_member' })
export class PgOrganizationMember extends PgBaseEntity {
  @ManyToOne(() => PgUser, (user) => user.organizationsMember)
  @JoinColumn({ name: 'user_id' })
  user!: PgUser

  @ManyToOne(() => PgOrganization, (organization) => organization.members)
  @JoinColumn({ name: 'organization_id' })
  organization!: PgOrganization

  @OneToOne(() => PgAdmissionProposal)
  @JoinColumn({ name: 'admission_proposal_id' })
  admissionProposal!: PgAdmissionProposal

  @Column({ name: 'join_date', type: 'timestamp', nullable: false })
  joinDate!: Date
}
