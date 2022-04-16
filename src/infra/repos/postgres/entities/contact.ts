import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { PgUser } from '@/infra/repos/postgres/entities/user'

type Email = {
  type: string
  address: string
}
type Phone = {
  type: string
  number: string
  countryCode: string
  areaCode: string
}

@Entity({ name: 'contact' })
export class PgContact {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ type: 'boolean', default: false })
  verified!: boolean

  @Column({ nullable: false })
  type!: string

  @Column({ type: 'jsonb', nullable: false })
  value!: Email | Phone

  @ManyToOne(() => PgUser, (user) => user.contacts, {
    cascade: ['insert'],
    nullable: false,
  })
  user!: Promise<PgUser>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
