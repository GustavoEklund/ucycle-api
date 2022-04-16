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

@Entity({ name: 'document' })
export class PgDocument {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column({ nullable: false })
  type!: string

  @Column({ nullable: false })
  number!: string

  @ManyToOne(() => PgUser, (user) => user.documents, { nullable: false })
  user!: Promise<PgUser>

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt?: Date
}
