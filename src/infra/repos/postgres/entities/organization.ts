import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PgAddress, PgUser } from '@/infra/repos/postgres/entities'
import { PgImage } from '@/infra/repos/postgres/entities/image'

@Entity({ name: 'organization' })
export class PgOrganization {
  @PrimaryGeneratedColumn('uuid')
  id!: string

  @Column()
  name!: string

  @ManyToOne(() => PgAddress, (address) => address.organizations)
  address!: PgAddress

  @OneToMany(() => PgImage, (image) => image.organization)
  pictures!: Promise<PgImage[]>

  @ManyToOne(() => PgUser, (user) => user.organizations)
  ownerUser!: PgUser

  @CreateDateColumn()
  createdAt!: Date

  @UpdateDateColumn()
  updatedAt!: Date

  @DeleteDateColumn()
  deletedAt!: Date
}
