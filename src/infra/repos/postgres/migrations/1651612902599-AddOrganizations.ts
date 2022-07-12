import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddOrganizations1651612902599 implements MigrationInterface {
  name = 'AddOrganizations1651612902599'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE "document" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "type" character varying NOT NULL,
            "number" character varying NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            "deletedAt" TIMESTAMP,
            "userId" uuid NOT NULL,
            CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id")
        )
    `)
    await queryRunner.query(`
        CREATE TABLE "contact" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "verified" boolean NOT NULL DEFAULT false,
            "type" character varying NOT NULL,
            "value" jsonb NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            "deletedAt" TIMESTAMP,
            "userId" uuid NOT NULL,
            CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id")
        )
    `)
    await queryRunner.query(`
        CREATE TABLE "image" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "url" character varying NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            "deletedAt" TIMESTAMP,
            "organizationId" uuid,
            "createdById" uuid,
            CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id")
        )
    `)
    await queryRunner.query(`
        CREATE TABLE "organization" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "name" character varying NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            "deletedAt" TIMESTAMP,
            "addressId" uuid,
            "ownerUserId" uuid,
            CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id")
        )
    `)
    await queryRunner.query(`
        CREATE TABLE "user" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "firstName" character varying NOT NULL,
            "lastName" character varying NOT NULL,
            "firstAccess" boolean NOT NULL DEFAULT false,
            "pictureUrl" character varying,
            "initials" character varying,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            "deletedAt" TIMESTAMP,
            CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
        )
    `)
    await queryRunner.query(`
        CREATE TABLE "address" (
            "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
            "state" character varying NOT NULL,
            "city" character varying NOT NULL,
            "neighbourhood" character varying NOT NULL,
            "street" character varying NOT NULL,
            "buildingNumber" integer NOT NULL,
            "postalCode" character varying NOT NULL,
            "country" character varying NOT NULL,
            "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
            "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
            "deletedAt" TIMESTAMP,
            "createdById" uuid,
            CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id")
        )
    `)
    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "FK_7424ddcbdf1e9b067669eb0d3fd" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "contact" ADD CONSTRAINT "FK_e7e34fa8e409e9146f4729fd0cb" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_31fb1e3b1313f04e7731f8f08f3" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_54915a9d5a77e86c48fe9590b24" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_63c0d3f228775d613e037b94e25" FOREIGN KEY ("addressId") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_a250b4517774f73d0fcb5cb8e26" FOREIGN KEY ("ownerUserId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_66b4199652a07c303e67c6aa646" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_66b4199652a07c303e67c6aa646"`
    )
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_a250b4517774f73d0fcb5cb8e26"`
    )
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_63c0d3f228775d613e037b94e25"`
    )
    await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_54915a9d5a77e86c48fe9590b24"`)
    await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_31fb1e3b1313f04e7731f8f08f3"`)
    await queryRunner.query(
      `ALTER TABLE "contact" DROP CONSTRAINT "FK_e7e34fa8e409e9146f4729fd0cb"`
    )
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "FK_7424ddcbdf1e9b067669eb0d3fd"`
    )
    await queryRunner.query(`DROP TABLE "address"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP TABLE "organization"`)
    await queryRunner.query(`DROP TABLE "image"`)
    await queryRunner.query(`DROP TABLE "contact"`)
    await queryRunner.query(`DROP TABLE "document"`)
  }
}
