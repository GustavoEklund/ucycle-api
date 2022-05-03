//TODO: create document and contact repository

import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity({ name: 'persons' })
export class PgPersons {
  @PrimaryGeneratedColumn('uuid')
  id!: number

  @Column()
  firstName!: string
  @Column()
  lastName!: string

  // document: Address;
  // contact: number;
  @Column()
  birthDate?: number
  @Column()
  professional?: string
  @Column()
  marriedStatus?: string

  @Column()
  specialNeeds!: boolean
  @Column()
  specialNeedsDescription?: string

  @Column()
  name!: string

  @Column()
  address!: object

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
