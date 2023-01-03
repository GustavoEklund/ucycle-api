import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddEmailTemplate1667501833757 implements MigrationInterface {
  name = 'AddEmailTemplate1667501833757'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_80954ad748656161b93eff4bf60"`
    )
    await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_31fb1e3b1313f04e7731f8f08f3"`)
    await queryRunner.query(
      `CREATE TABLE "email_template" (
          "id" character varying NOT NULL DEFAULT uuid_generate_v4(),
          "code" character varying NOT NULL,
          "version" character varying NOT NULL,
          "title" character varying NOT NULL,
          "content" text NOT NULL,
          "created_at" TIMESTAMP NOT NULL DEFAULT now(),
          "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
          "deleted_at" TIMESTAMP,
          "previous_version_id" character varying,
          "next_version_id" character varying,
          "created_by" uuid NOT NULL,
          CONSTRAINT "REL_088f1c10d9eeedb83e06a3ecf0" UNIQUE ("previous_version_id"),
          CONSTRAINT "REL_17c09c6f7263bd9bd42f3bb1a4" UNIQUE ("next_version_id"),
          CONSTRAINT "PK_75516149cfb4097dbe1ffd19b10" PRIMARY KEY ("id", "code", "version")
      );
      COMMENT ON COLUMN "email_template"."id" IS 'any generic identifier';
      COMMENT ON COLUMN "email_template"."code" IS 'event identifier code';
      COMMENT ON COLUMN "email_template"."version" IS 'unique version identifier';
      COMMENT ON COLUMN "email_template"."created_at" IS 'the date and time when the permission was created';
      COMMENT ON COLUMN "email_template"."updated_at" IS 'the date when the permission was updated last time';
      COMMENT ON COLUMN "email_template"."deleted_at" IS 'the date when the permission was deleted, null if not deleted';
      COMMENT ON COLUMN "email_template"."previous_version_id" IS 'any generic identifier';
      COMMENT ON COLUMN "email_template"."next_version_id" IS 'any generic identifier';
      COMMENT ON COLUMN "email_template"."created_by" IS 'uuid primary key';`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_c90815fd4ca9119f1946220771" ON "email_template" ("id")`
    )
    await queryRunner.query(
      `ALTER TABLE "email_template"
          ADD CONSTRAINT "FK_088f1c10d9eeedb83e06a3ecf0d"
              FOREIGN KEY ("previous_version_id") REFERENCES "email_template"("id")
                  ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "email_template"
          ADD CONSTRAINT "FK_17c09c6f7263bd9bd42f3bb1a4f"
              FOREIGN KEY ("next_version_id") REFERENCES "email_template"("id")
                  ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "email_template"
          ADD CONSTRAINT "FK_1d4e47afdfbe07d49dd2c874f7d"
              FOREIGN KEY ("user_id") REFERENCES "user"("id")
                  ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "organization"
          ADD CONSTRAINT "FK_907dff73c9b0e5b4ecd3afad3a9"
              FOREIGN KEY ("user_permission_id") REFERENCES "user_permission"("id")
                  ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "image"
          ADD CONSTRAINT "FK_a9d7a581f3243f668fb3a2b34f9"
              FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
                  ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_a9d7a581f3243f668fb3a2b34f9"`)
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_907dff73c9b0e5b4ecd3afad3a9"`
    )
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP CONSTRAINT "FK_1d4e47afdfbe07d49dd2c874f7d"`
    )
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP CONSTRAINT "FK_17c09c6f7263bd9bd42f3bb1a4f"`
    )
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP CONSTRAINT "FK_088f1c10d9eeedb83e06a3ecf0d"`
    )
    await queryRunner.query(`DROP INDEX "IDX_c90815fd4ca9119f1946220771"`)
    await queryRunner.query(`DROP TABLE "email_template"`)
    await queryRunner.query(
      `ALTER TABLE "image"
          ADD CONSTRAINT "FK_31fb1e3b1313f04e7731f8f08f3"
              FOREIGN KEY ("organization_id") REFERENCES "organization"("id")
                  ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "organization"
          ADD CONSTRAINT "FK_80954ad748656161b93eff4bf60"
              FOREIGN KEY ("user_permission_id") REFERENCES "user_permission"("id")
                  ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
