// TODO: create document and contact repository

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'persons' })
export class PgPersons {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  firstName!: string

  @Column()
  lastName!: string

  // document: Address;
  // contact: number;

  @Column()
  birthDate?: string

  @Column()
  professional?: string

  @Column()
  marriedStatus?: string

  @Column({ type: 'boolean', default: false })
  specialNeeds!: boolean

  @Column()
  specialNeedsDescription?: string

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
