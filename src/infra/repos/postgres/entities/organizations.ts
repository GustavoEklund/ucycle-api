import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

@Entity({ name: 'organization' })
export class PgOrganization {
  @PrimaryGeneratedColumn()
  id!: number

  @Column()
  name!: string

  @Column()
  address!: object

  @Column()
  ownerUserId!: number
}
