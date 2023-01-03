import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

import { PgUser } from '@/infra/repos/postgres/entities'

@Entity({ name: 'email_template' })
@Index(['id'], { unique: true })
export class PgEmailTemplate {
  @PrimaryColumn({
    name: 'id',
    type: 'varchar',
    unique: true,
    nullable: false,
    default: () => 'uuid_generate_v4()',
    comment: 'any generic identifier',
  })
  id!: string

  @PrimaryColumn({
    name: 'code',
    type: 'varchar',
    unique: false,
    nullable: false,
    comment: 'event identifier code',
  })
  code!: string

  @PrimaryColumn({
    name: 'version',
    type: 'varchar',
    unique: false,
    nullable: false,
    comment: 'version identifier',
  })
  version!: string

  @OneToOne(() => PgEmailTemplate, (emailTemplate) => emailTemplate.nextVersion, { nullable: true })
  @JoinColumn({ name: 'previous_version_id', referencedColumnName: 'id' })
  previousVersion?: PgEmailTemplate

  @OneToOne(() => PgEmailTemplate, (emailTemplate) => emailTemplate.previousVersion, {
    nullable: true,
  })
  @JoinColumn({ name: 'next_version_id', referencedColumnName: 'id' })
  nextVersion?: PgEmailTemplate

  @Column({ name: 'title', type: 'varchar', nullable: false })
  title!: string

  @Column({ name: 'content', type: 'text', nullable: false })
  content!: string

  @ManyToOne(() => PgUser, (user) => user.emailTemplates, { nullable: false })
  @JoinColumn({ name: 'created_by', referencedColumnName: 'id' })
  createdBy!: PgUser

  @CreateDateColumn({
    name: 'created_at',
    comment: 'the date and time when the permission was created',
  })
  createdAt!: Date

  @UpdateDateColumn({
    name: 'updated_at',
    comment: 'the date when the permission was updated last time',
  })
  updatedAt!: Date

  @DeleteDateColumn({
    name: 'deleted_at',
    comment: 'the date when the permission was deleted, null if not deleted',
  })
  deletedAt?: Date
}
