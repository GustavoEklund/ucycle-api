import { MigrationInterface, QueryRunner } from 'typeorm'

export class Address1677962576009 implements MigrationInterface {
  name = 'Address1677962576009'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "coupon" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "percentage" integer NOT NULL, "expire_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_fcbe9d72b60eed35f46dc35a682" PRIMARY KEY ("id")); COMMENT ON COLUMN "coupon"."id" IS 'uuid primary key'; COMMENT ON COLUMN "coupon"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "coupon"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "coupon"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "coupon"."user_id" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "freight" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")); COMMENT ON COLUMN "order"."id" IS 'uuid primary key'; COMMENT ON COLUMN "order"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "order"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "order"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "order"."user_id" IS 'uuid primary key'`
    )
    await queryRunner.query(`ALTER TABLE "address" ADD "landmark" character varying`)
    await queryRunner.query(`ALTER TABLE "address" ADD "type" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "address" ADD "is_default" boolean NOT NULL`)
    await queryRunner.query(`ALTER TABLE "address" ADD "phone_contact_id" uuid`)
    await queryRunner.query(`COMMENT ON COLUMN "address"."phone_contact_id" IS 'uuid primary key'`)
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP CONSTRAINT "FK_17c09c6f7263bd9bd42f3bb1a4f"`
    )
    await queryRunner.query(`ALTER TABLE "email_template" ALTER COLUMN "id" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "email_template" ALTER COLUMN "id" SET DEFAULT uuid_generate_v4()`
    )
    await queryRunner.query(
      `ALTER TABLE "coupon" ADD CONSTRAINT "FK_05e2d1d174be912392277fc095c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "email_template" ADD CONSTRAINT "FK_17c09c6f7263bd9bd42f3bb1a4f" FOREIGN KEY ("next_version_id") REFERENCES "email_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_2a3f81b9710e1821fda39dfe93b" FOREIGN KEY ("phone_contact_id") REFERENCES "contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_2a3f81b9710e1821fda39dfe93b"`
    )
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd"`)
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP CONSTRAINT "FK_17c09c6f7263bd9bd42f3bb1a4f"`
    )
    await queryRunner.query(`ALTER TABLE "coupon" DROP CONSTRAINT "FK_05e2d1d174be912392277fc095c"`)
    await queryRunner.query(`ALTER TABLE "email_template" ALTER COLUMN "id" DROP DEFAULT`)
    await queryRunner.query(
      `ALTER TABLE "email_template" ALTER COLUMN "id" SET DEFAULT nextval('email_template_id_seq')`
    )
    await queryRunner.query(
      `ALTER TABLE "email_template" ADD CONSTRAINT "FK_17c09c6f7263bd9bd42f3bb1a4f" FOREIGN KEY ("next_version_id") REFERENCES "email_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(`COMMENT ON COLUMN "address"."phone_contact_id" IS 'uuid primary key'`)
    await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "phone_contact_id"`)
    await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "is_default"`)
    await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "type"`)
    await queryRunner.query(`ALTER TABLE "address" DROP COLUMN "landmark"`)
    await queryRunner.query(`DROP TABLE "order"`)
    await queryRunner.query(`DROP TABLE "coupon"`)
  }
}
