import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm'
import { PgOrganization } from './organizations'

@Entity({ name: 'user' })
export class PgUser {
  @PrimaryGeneratedColumn()
  id!: number

  @Column({ nullable: true })
  name?: string

  @Column()
  email!: string

  @Column({ nullable: true })
  facebookId?: string

  @Column({ nullable: true })
  pictureUrl?: string

  @Column({ nullable: true })
  initials?: string

  @OneToMany(() => PgOrganization, (organization) => organization.ownerUser)
  organizations?: PgOrganization[]
}
