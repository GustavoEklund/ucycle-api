import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm'
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
}
