import { Column, Entity } from 'typeorm'

import { PgBaseEntity } from '@/infra/repos/postgres/entities/base-entity'

export enum PgPersonMaritalStatus {
  single = 'SINGLE',
  married = 'MARRIED',
  divorced = 'DIVORCED',
  widowed = 'WIDOWED',
}

@Entity({ name: 'persons' })
export class PgPerson extends PgBaseEntity {
  @Column({ name: 'first_name', nullable: false })
  firstName!: string

  @Column({ name: 'last_name', nullable: false })
  lastName!: string

  // document: Address;
  // contact: number;

  @Column({ name: 'birth_date', nullable: true })
  birthDate?: string

  @Column()
  professional?: string

  @Column({
    type: 'enum',
    enum: PgPersonMaritalStatus,
    name: 'marital_status',
    comment: 'the marital status can be either single, married, divorced, widowed',
  })
  maritalStatus?: PgPersonMaritalStatus

  @Column({ name: 'has_special_needs', type: 'boolean', default: false })
  hasSpecialNeeds!: boolean

  @Column({ name: 'special_needs_description', nullable: true })
  specialNeedsDescription?: string
}
