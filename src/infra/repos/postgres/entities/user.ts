import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm'

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
}
