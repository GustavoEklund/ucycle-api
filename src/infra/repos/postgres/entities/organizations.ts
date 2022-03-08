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
  id!: number

  @Column()
  name!: string

  @Column()
  address!: object

  @ManyToOne(() => PgUser, (user) => user.id)
  ownerUser!: PgUser

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
