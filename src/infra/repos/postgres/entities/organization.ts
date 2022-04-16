import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PgUser } from './user'

@Entity({ name: 'organization' })
export class PgOrganization {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name!: string

  @Column()
  city!: string

  @Column()
  state!: string

  @Column()
  country!: string

  @Column()
  street!: string

  @Column()
  neighbourhood!: string

  @Column()
  buildingNumber!: number

  @ManyToOne(() => PgUser, (user) => user.organizations)
  ownerUser!: PgUser

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
