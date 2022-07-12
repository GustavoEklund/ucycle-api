import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOrganizationMembers1654122489914 implements MigrationInterface {
  name = 'AddOrganizationMembers1654122489914'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "persons" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "birthDate" character varying NOT NULL,
        "professional" character varying NOT NULL,
        "marriedStatus" character varying NOT NULL,
        "specialNeeds" boolean NOT NULL DEFAULT false,
        "specialNeedsDescription" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP, CONSTRAINT "PK_74278d8812a049233ce41440ac7" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`
      CREATE TABLE "admission_proposal" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "status" character varying NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP, "organizationId" uuid,
        "createdById" uuid,
        CONSTRAINT "PK_781c8ac3831e2ff1dab99d885fe" PRIMARY KEY ("id")
      )
    `)
    await queryRunner.query(`
      CREATE TABLE "organization_members" (
        "organizationId" uuid NOT NULL,
        "userId" uuid NOT NULL,
        CONSTRAINT "PK_7c48546e8026fb043d9ad0c2c8c"
        PRIMARY KEY ("organizationId", "userId")
      )
    `)
    await queryRunner.query(
      `CREATE INDEX "IDX_5652c2c6b066835b6c500d0d83" ON "organization_members" ("organizationId") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_e826222ad017663c6db1a45a4f" ON "organization_members" ("userId") `
    )
    await queryRunner.query(`ALTER TABLE "contact" ADD "label" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "value"`)
    await queryRunner.query(`ALTER TABLE "contact" ADD "value" character varying NOT NULL`)
    await queryRunner.query(
      `ALTER TABLE "admission_proposal" ADD CONSTRAINT "FK_4a99ce7b5ffd98944b8b6feacb4" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "admission_proposal" ADD CONSTRAINT "FK_1d2ef25f7e754781945cdda3065" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "organization_members" ADD CONSTRAINT "FK_5652c2c6b066835b6c500d0d83f" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "organization_members" ADD CONSTRAINT "FK_e826222ad017663c6db1a45a4f1" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization_members" DROP CONSTRAINT "FK_e826222ad017663c6db1a45a4f1"`
    )
    await queryRunner.query(
      `ALTER TABLE "organization_members" DROP CONSTRAINT "FK_5652c2c6b066835b6c500d0d83f"`
    )
    await queryRunner.query(
      `ALTER TABLE "admission_proposal" DROP CONSTRAINT "FK_1d2ef25f7e754781945cdda3065"`
    )
    await queryRunner.query(
      `ALTER TABLE "admission_proposal" DROP CONSTRAINT "FK_4a99ce7b5ffd98944b8b6feacb4"`
    )
    await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "value"`)
    await queryRunner.query(`ALTER TABLE "contact" ADD "value" jsonb NOT NULL`)
    await queryRunner.query(`ALTER TABLE "contact" DROP COLUMN "label"`)
    await queryRunner.query(`DROP INDEX "IDX_e826222ad017663c6db1a45a4f"`)
    await queryRunner.query(`DROP INDEX "IDX_5652c2c6b066835b6c500d0d83"`)
    await queryRunner.query(`DROP TABLE "organization_members"`)
    await queryRunner.query(`DROP TABLE "admission_proposal"`)
    await queryRunner.query(`DROP TABLE "persons"`)
  }
}
