import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddMoreOrderDetails1685758346614 implements MigrationInterface {
  name = 'AddMoreOrderDetails1685758346614'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`
    )
    await queryRunner.query(
      `CREATE TABLE "order_item" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "picture_url" character varying NOT NULL, "amount" integer NOT NULL, "price_in_cents" integer NOT NULL, "total_in_cents" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "product_id" uuid, "order_id" uuid, "created_by" uuid, CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY ("id")); COMMENT ON COLUMN "order_item"."id" IS 'uuid primary key'; COMMENT ON COLUMN "order_item"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "order_item"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "order_item"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "order_item"."product_id" IS 'uuid primary key'; COMMENT ON COLUMN "order_item"."order_id" IS 'uuid primary key'; COMMENT ON COLUMN "order_item"."created_by" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "order_coupon" ("order_id" uuid NOT NULL, "coupon_id" uuid NOT NULL, CONSTRAINT "PK_393d4401028eac3ff164705648c" PRIMARY KEY ("order_id", "coupon_id"))`
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_187add5104edc004fb55c13b86" ON "order_coupon" ("order_id") `
    )
    await queryRunner.query(
      `CREATE INDEX "IDX_7cea48878f253b9aa9f19b14bb" ON "order_coupon" ("coupon_id") `
    )
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "freight"`)
    await queryRunner.query(
      `ALTER TABLE "order" ADD "shipping_price_in_cents" double precision NOT NULL`
    )
    await queryRunner.query(`ALTER TABLE "order" ADD "estimated_delivery_date" date NOT NULL`)
    await queryRunner.query(`ALTER TABLE "order" ADD "status" character varying NOT NULL`)
    await queryRunner.query(`ALTER TABLE "order" ADD "total_in_cents" double precision NOT NULL`)
    await queryRunner.query(`ALTER TABLE "order" ADD "shipping_address_id" uuid`)
    await queryRunner.query(`COMMENT ON COLUMN "order"."shipping_address_id" IS 'uuid primary key'`)
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_19b0c6293443d1b464f604c3316" FOREIGN KEY ("shipping_address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1" FOREIGN KEY ("category_id") REFERENCES "product_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_5e17c017aa3f5164cb2da5b1c6b" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_e9674a6053adbaa1057848cddfa" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order_item" ADD CONSTRAINT "FK_130f9abd1e8cdafc35e18caa45c" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order_coupon" ADD CONSTRAINT "FK_187add5104edc004fb55c13b865" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order_coupon" ADD CONSTRAINT "FK_7cea48878f253b9aa9f19b14bb2" FOREIGN KEY ("coupon_id") REFERENCES "coupon"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "order_coupon" DROP CONSTRAINT "FK_7cea48878f253b9aa9f19b14bb2"`
    )
    await queryRunner.query(
      `ALTER TABLE "order_coupon" DROP CONSTRAINT "FK_187add5104edc004fb55c13b865"`
    )
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_130f9abd1e8cdafc35e18caa45c"`
    )
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_e9674a6053adbaa1057848cddfa"`
    )
    await queryRunner.query(
      `ALTER TABLE "order_item" DROP CONSTRAINT "FK_5e17c017aa3f5164cb2da5b1c6b"`
    )
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_0dce9bc93c2d2c399982d04bef1"`
    )
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_19b0c6293443d1b464f604c3316"`)
    await queryRunner.query(`COMMENT ON COLUMN "order"."shipping_address_id" IS 'uuid primary key'`)
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shipping_address_id"`)
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "total_in_cents"`)
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "status"`)
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "estimated_delivery_date"`)
    await queryRunner.query(`ALTER TABLE "order" DROP COLUMN "shipping_price_in_cents"`)
    await queryRunner.query(`ALTER TABLE "order" ADD "freight" double precision NOT NULL`)
    await queryRunner.query(`DROP INDEX "IDX_7cea48878f253b9aa9f19b14bb"`)
    await queryRunner.query(`DROP INDEX "IDX_187add5104edc004fb55c13b86"`)
    await queryRunner.query(`DROP TABLE "order_coupon"`)
    await queryRunner.query(`DROP TABLE "order_item"`)
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("category_id") REFERENCES "product_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }
}
