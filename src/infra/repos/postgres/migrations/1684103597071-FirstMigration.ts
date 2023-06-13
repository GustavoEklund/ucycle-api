import { MigrationInterface, QueryRunner } from 'typeorm'

export class FirstMigration1684103597071 implements MigrationInterface {
  name = 'FirstMigration1684103597071'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "admission_proposal" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" "admission_proposal_status_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "organization_id" uuid, "created_by" uuid, CONSTRAINT "PK_781c8ac3831e2ff1dab99d885fe" PRIMARY KEY ("id")); COMMENT ON COLUMN "admission_proposal"."id" IS 'uuid primary key'; COMMENT ON COLUMN "admission_proposal"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "admission_proposal"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "admission_proposal"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "admission_proposal"."organization_id" IS 'uuid primary key'; COMMENT ON COLUMN "admission_proposal"."created_by" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "base_permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(100) NOT NULL, "name" character varying(256) NOT NULL, "description" character varying(256), "read" boolean NOT NULL DEFAULT false, "write" boolean NOT NULL DEFAULT false, "owner" boolean NOT NULL DEFAULT false, "status" "base_permission_status_enum" NOT NULL, "expires_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "module_id" uuid NOT NULL, "created_by" uuid, CONSTRAINT "UQ_466d8a3c63f858f4b3ba4cd263c" UNIQUE ("code"), CONSTRAINT "PK_407dfc97728bbbf8b46fea6f9cc" PRIMARY KEY ("id")); COMMENT ON COLUMN "base_permission"."id" IS 'uuid primary key'; COMMENT ON COLUMN "base_permission"."code" IS 'the unique code to identify the permission'; COMMENT ON COLUMN "base_permission"."name" IS 'the name of the permission'; COMMENT ON COLUMN "base_permission"."description" IS 'the description of the permission'; COMMENT ON COLUMN "base_permission"."read" IS 'if has read permission'; COMMENT ON COLUMN "base_permission"."write" IS 'if has write permission'; COMMENT ON COLUMN "base_permission"."owner" IS 'if has owner permission'; COMMENT ON COLUMN "base_permission"."status" IS 'the permission status can be either GRANTED or REVOKED'; COMMENT ON COLUMN "base_permission"."expires_at" IS 'the date when the permission expires'; COMMENT ON COLUMN "base_permission"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "base_permission"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "base_permission"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "base_permission"."module_id" IS 'uuid primary key'; COMMENT ON COLUMN "base_permission"."created_by" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "contact" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "verified" boolean NOT NULL DEFAULT false, "is_private" boolean NOT NULL DEFAULT false, "type" character varying NOT NULL, "label" character varying NOT NULL, "value" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "PK_2cbbe00f59ab6b3bb5b8d19f989" PRIMARY KEY ("id")); COMMENT ON COLUMN "contact"."id" IS 'uuid primary key'; COMMENT ON COLUMN "contact"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "contact"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "contact"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "contact"."user_id" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "coupon" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "percentage" integer NOT NULL, "expire_date" TIMESTAMP NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_fcbe9d72b60eed35f46dc35a682" PRIMARY KEY ("id")); COMMENT ON COLUMN "coupon"."id" IS 'uuid primary key'; COMMENT ON COLUMN "coupon"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "coupon"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "coupon"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "coupon"."user_id" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "document" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying NOT NULL, "number" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid NOT NULL, CONSTRAINT "PK_e57d3357f83f3cdc0acffc3d777" PRIMARY KEY ("id")); COMMENT ON COLUMN "document"."id" IS 'uuid primary key'; COMMENT ON COLUMN "document"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "document"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "document"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "document"."user_id" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "email_template" ("id" character varying NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "version" character varying NOT NULL, "title" character varying NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "previous_version_id" character varying, "next_version_id" character varying, "created_by" uuid NOT NULL, CONSTRAINT "REL_088f1c10d9eeedb83e06a3ecf0" UNIQUE ("previous_version_id"), CONSTRAINT "REL_17c09c6f7263bd9bd42f3bb1a4" UNIQUE ("next_version_id"), CONSTRAINT "PK_75516149cfb4097dbe1ffd19b10" PRIMARY KEY ("id", "code", "version")); COMMENT ON COLUMN "email_template"."id" IS 'any generic identifier'; COMMENT ON COLUMN "email_template"."code" IS 'event identifier code'; COMMENT ON COLUMN "email_template"."version" IS 'version identifier'; COMMENT ON COLUMN "email_template"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "email_template"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "email_template"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "email_template"."previous_version_id" IS 'any generic identifier'; COMMENT ON COLUMN "email_template"."next_version_id" IS 'any generic identifier'; COMMENT ON COLUMN "email_template"."created_by" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_c90815fd4ca9119f1946220771" ON "email_template" ("id") `
    )
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "first_access" boolean NOT NULL DEFAULT true, "picture_url" character varying, "initials" character varying(2), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")); COMMENT ON COLUMN "user"."id" IS 'uuid primary key'; COMMENT ON COLUMN "user"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "user"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "user"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'`
    )
    await queryRunner.query(
      `CREATE TABLE "error_log" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "message" character varying NOT NULL, "stack" text, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid, CONSTRAINT "PK_0284e7aa7afe77ea1ce1621c252" PRIMARY KEY ("id")); COMMENT ON COLUMN "error_log"."id" IS 'uuid primary key'; COMMENT ON COLUMN "error_log"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "error_log"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "error_log"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "error_log"."created_by" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "url" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "product_id" uuid, "organization_id" uuid, "created_by" uuid, CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id")); COMMENT ON COLUMN "image"."id" IS 'uuid primary key'; COMMENT ON COLUMN "image"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "image"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "image"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "image"."product_id" IS 'uuid primary key'; COMMENT ON COLUMN "image"."organization_id" IS 'uuid primary key'; COMMENT ON COLUMN "image"."created_by" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "module" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid, CONSTRAINT "PK_0e20d657f968b051e674fbe3117" PRIMARY KEY ("id")); COMMENT ON COLUMN "module"."id" IS 'uuid primary key'; COMMENT ON COLUMN "module"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "module"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "module"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "module"."created_by" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "order" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "freight" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "user_id" uuid, CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY ("id")); COMMENT ON COLUMN "order"."id" IS 'uuid primary key'; COMMENT ON COLUMN "order"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "order"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "order"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "order"."user_id" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "organization" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "address_id" uuid, "owner_user_id" uuid, "user_permission_id" uuid, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id")); COMMENT ON COLUMN "organization"."id" IS 'uuid primary key'; COMMENT ON COLUMN "organization"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "organization"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "organization"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "organization"."address_id" IS 'uuid primary key'; COMMENT ON COLUMN "organization"."owner_user_id" IS 'uuid primary key'; COMMENT ON COLUMN "organization"."user_permission_id" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "organization_member" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "join_date" TIMESTAMP NOT NULL, "user_id" uuid, "organization_id" uuid, "admission_proposal_id" uuid, CONSTRAINT "REL_8e00ba39cecfd1607bd1aa1f18" UNIQUE ("admission_proposal_id"), CONSTRAINT "PK_81dbbb093cbe0539c170f3d1484" PRIMARY KEY ("id")); COMMENT ON COLUMN "organization_member"."id" IS 'uuid primary key'; COMMENT ON COLUMN "organization_member"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "organization_member"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "organization_member"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "organization_member"."user_id" IS 'uuid primary key'; COMMENT ON COLUMN "organization_member"."organization_id" IS 'uuid primary key'; COMMENT ON COLUMN "organization_member"."admission_proposal_id" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "person" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "birth_date" character varying, "professional" character varying NOT NULL, "marital_status" "person_marital_status_enum" NOT NULL, "has_special_needs" boolean NOT NULL DEFAULT false, "special_needs_description" character varying, CONSTRAINT "PK_5fdaf670315c4b7e70cce85daa3" PRIMARY KEY ("id")); COMMENT ON COLUMN "person"."id" IS 'uuid primary key'; COMMENT ON COLUMN "person"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "person"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "person"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "person"."marital_status" IS 'the marital status can be either SINGLE, MARRIED, DIVORCED, WIDOWED'`
    )
    await queryRunner.query(
      `CREATE TABLE "shopping_cart" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid, CONSTRAINT "PK_40f9358cdf55d73d8a2ad226592" PRIMARY KEY ("id")); COMMENT ON COLUMN "shopping_cart"."id" IS 'uuid primary key'; COMMENT ON COLUMN "shopping_cart"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "shopping_cart"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "shopping_cart"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "shopping_cart"."created_by" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "shopping_cart_product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "amount" integer NOT NULL, "priceInCents" integer NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "productId" uuid, "shoppingCartId" uuid, CONSTRAINT "PK_e9714a8554c8b915d109d3de5c9" PRIMARY KEY ("id")); COMMENT ON COLUMN "shopping_cart_product"."id" IS 'uuid primary key'; COMMENT ON COLUMN "shopping_cart_product"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "shopping_cart_product"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "shopping_cart_product"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "shopping_cart_product"."productId" IS 'uuid primary key'; COMMENT ON COLUMN "shopping_cart_product"."shoppingCartId" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "product" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" text NOT NULL, "total_price_in_cents" integer NOT NULL, "total_discount_in_percentage" integer, "condition" "product_condition_enum" NOT NULL, "warranty_duration_time" integer NOT NULL, "warranty_duration_unit" "product_warranty_duration_unit_enum" NOT NULL, "warranty_type" "product_warranty_type_enum" NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "categoryId" uuid NOT NULL, "created_by" uuid NOT NULL, CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")); COMMENT ON COLUMN "product"."id" IS 'uuid primary key'; COMMENT ON COLUMN "product"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "product"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "product"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "product"."categoryId" IS 'uuid primary key'; COMMENT ON COLUMN "product"."created_by" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "product_category" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(32) NOT NULL, "name" character varying NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "parentCategoryId" uuid, "created_by" uuid, CONSTRAINT "UQ_b8c9d50238e056e452f29ef7686" UNIQUE ("code"), CONSTRAINT "PK_0dce9bc93c2d2c399982d04bef1" PRIMARY KEY ("id")); COMMENT ON COLUMN "product_category"."id" IS 'uuid primary key'; COMMENT ON COLUMN "product_category"."code" IS 'unique identification for product category as a code'; COMMENT ON COLUMN "product_category"."name" IS 'displayable name'; COMMENT ON COLUMN "product_category"."description" IS 'displayable comment'; COMMENT ON COLUMN "product_category"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "product_category"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "product_category"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "product_category"."parentCategoryId" IS 'uuid primary key'; COMMENT ON COLUMN "product_category"."created_by" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "user_permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying(100) NOT NULL, "name" character varying(256) NOT NULL, "description" character varying(256), "read" boolean NOT NULL DEFAULT false, "write" boolean NOT NULL DEFAULT false, "owner" boolean NOT NULL DEFAULT false, "status" "user_permission_status_enum" NOT NULL, "expires_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "module_id" uuid NOT NULL, "created_by_user_id" uuid NOT NULL, "grant_to_user_id" uuid NOT NULL, "grant_at_organization_id" uuid NOT NULL, CONSTRAINT "UQ_eb1841f5c2964e96aea5cbf7bee" UNIQUE ("code"), CONSTRAINT "PK_a7326749e773c740a7104634a77" PRIMARY KEY ("id")); COMMENT ON COLUMN "user_permission"."id" IS 'uuid primary key'; COMMENT ON COLUMN "user_permission"."code" IS 'the code to identify the permission, comes from base permission'; COMMENT ON COLUMN "user_permission"."name" IS 'the name of the permission'; COMMENT ON COLUMN "user_permission"."description" IS 'the description of the permission'; COMMENT ON COLUMN "user_permission"."read" IS 'if has read permission'; COMMENT ON COLUMN "user_permission"."write" IS 'if has write permission'; COMMENT ON COLUMN "user_permission"."owner" IS 'if has owner permission'; COMMENT ON COLUMN "user_permission"."status" IS 'the permission status can be either GRANTED or REVOKED'; COMMENT ON COLUMN "user_permission"."expires_at" IS 'the date when the permission expires'; COMMENT ON COLUMN "user_permission"."created_at" IS 'the date when the permission was created'; COMMENT ON COLUMN "user_permission"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "user_permission"."deleted_at" IS 'the date when the permission was deleted'; COMMENT ON COLUMN "user_permission"."module_id" IS 'uuid primary key'; COMMENT ON COLUMN "user_permission"."created_by_user_id" IS 'uuid primary key'; COMMENT ON COLUMN "user_permission"."grant_to_user_id" IS 'uuid primary key'; COMMENT ON COLUMN "user_permission"."grant_at_organization_id" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `CREATE TABLE "address" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "country" character varying NOT NULL, "street_name" character varying NOT NULL, "city" character varying NOT NULL, "neighbourhood" character varying NOT NULL, "street" character varying NOT NULL, "building_number" character varying, "landmark" character varying, "type" character varying NOT NULL, "zip_code" character varying(8) NOT NULL, "is_default" boolean NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "phone_contact_id" uuid, "created_by" uuid, CONSTRAINT "PK_d92de1f82754668b5f5f5dd4fd5" PRIMARY KEY ("id")); COMMENT ON COLUMN "address"."id" IS 'uuid primary key'; COMMENT ON COLUMN "address"."created_at" IS 'the date and time when the permission was created'; COMMENT ON COLUMN "address"."updated_at" IS 'the date when the permission was updated last time'; COMMENT ON COLUMN "address"."deleted_at" IS 'the date when the permission was deleted, null if not deleted'; COMMENT ON COLUMN "address"."phone_contact_id" IS 'uuid primary key'; COMMENT ON COLUMN "address"."created_by" IS 'uuid primary key'`
    )
    await queryRunner.query(
      `ALTER TABLE "admission_proposal" ADD CONSTRAINT "FK_3c516725c41f3bb8b32fa127f56" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "admission_proposal" ADD CONSTRAINT "FK_1dc74ec031daab6c629eeaf4314" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "base_permission" ADD CONSTRAINT "FK_94f7aa7d4e173bd0b03a9c546a5" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "base_permission" ADD CONSTRAINT "FK_65d300fbbaa12d8ea18e075edc3" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "contact" ADD CONSTRAINT "FK_33d4fc93803e7192e150216fffb" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "coupon" ADD CONSTRAINT "FK_05e2d1d174be912392277fc095c" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "document" ADD CONSTRAINT "FK_a24176a40152f41c98c09d8057d" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "email_template" ADD CONSTRAINT "FK_088f1c10d9eeedb83e06a3ecf0d" FOREIGN KEY ("previous_version_id") REFERENCES "email_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "email_template" ADD CONSTRAINT "FK_17c09c6f7263bd9bd42f3bb1a4f" FOREIGN KEY ("next_version_id") REFERENCES "email_template"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "email_template" ADD CONSTRAINT "FK_b6ee8e5ebd8cc8e306a2fdcdd23" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "error_log" ADD CONSTRAINT "FK_d9051348e9b139ef51b0722d583" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_e6a9e829e17fc47fc17d695af8e" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_a9d7a581f3243f668fb3a2b34f9" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "image" ADD CONSTRAINT "FK_ddf30fb1ae714982dd23bd7fb57" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "module" ADD CONSTRAINT "FK_9ceb34a8241471636decdbc6b34" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "order" ADD CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_0f31fe3925535afb5462326d7d6" FOREIGN KEY ("address_id") REFERENCES "address"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_046d51ce4adb4d92dcc1791cabe" FOREIGN KEY ("owner_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "organization" ADD CONSTRAINT "FK_907dff73c9b0e5b4ecd3afad3a9" FOREIGN KEY ("user_permission_id") REFERENCES "user_permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "organization_member" ADD CONSTRAINT "FK_273aa659a4afdcb614cdecbd667" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "organization_member" ADD CONSTRAINT "FK_ce08825728e5afefdc6e682b8d7" FOREIGN KEY ("organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "organization_member" ADD CONSTRAINT "FK_8e00ba39cecfd1607bd1aa1f185" FOREIGN KEY ("admission_proposal_id") REFERENCES "admission_proposal"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "shopping_cart" ADD CONSTRAINT "FK_87ffac1cdd3ba18252b8e674880" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "shopping_cart_product" ADD CONSTRAINT "FK_d4d72b7092badd219e53ea001a7" FOREIGN KEY ("productId") REFERENCES "product"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "shopping_cart_product" ADD CONSTRAINT "FK_d6d73cea8eedca8a556fa27fa0b" FOREIGN KEY ("shoppingCartId") REFERENCES "shopping_cart"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES "product_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product" ADD CONSTRAINT "FK_b5effca691499d21c5ec683ced6" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD CONSTRAINT "FK_a38ad62c794b2585da78c423e85" FOREIGN KEY ("parentCategoryId") REFERENCES "product_category"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "product_category" ADD CONSTRAINT "FK_fd1b8593e3cf8ea5c7dfdc23e8f" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_permission" ADD CONSTRAINT "FK_4784ffd727837739af684f95681" FOREIGN KEY ("module_id") REFERENCES "module"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_permission" ADD CONSTRAINT "FK_1e633a454da67f13836fd2e813b" FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_permission" ADD CONSTRAINT "FK_3c9d9c512a4718eac3770ee82fe" FOREIGN KEY ("grant_to_user_id") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_permission" ADD CONSTRAINT "FK_7675b0b1bfc3d9f39e24a9bc0a7" FOREIGN KEY ("grant_at_organization_id") REFERENCES "organization"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_2a3f81b9710e1821fda39dfe93b" FOREIGN KEY ("phone_contact_id") REFERENCES "contact"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "address" ADD CONSTRAINT "FK_97d5fd8d264f8deebac45a6fd0b" FOREIGN KEY ("created_by") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_97d5fd8d264f8deebac45a6fd0b"`
    )
    await queryRunner.query(
      `ALTER TABLE "address" DROP CONSTRAINT "FK_2a3f81b9710e1821fda39dfe93b"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_permission" DROP CONSTRAINT "FK_7675b0b1bfc3d9f39e24a9bc0a7"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_permission" DROP CONSTRAINT "FK_3c9d9c512a4718eac3770ee82fe"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_permission" DROP CONSTRAINT "FK_1e633a454da67f13836fd2e813b"`
    )
    await queryRunner.query(
      `ALTER TABLE "user_permission" DROP CONSTRAINT "FK_4784ffd727837739af684f95681"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_category" DROP CONSTRAINT "FK_fd1b8593e3cf8ea5c7dfdc23e8f"`
    )
    await queryRunner.query(
      `ALTER TABLE "product_category" DROP CONSTRAINT "FK_a38ad62c794b2585da78c423e85"`
    )
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_b5effca691499d21c5ec683ced6"`
    )
    await queryRunner.query(
      `ALTER TABLE "product" DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812"`
    )
    await queryRunner.query(
      `ALTER TABLE "shopping_cart_product" DROP CONSTRAINT "FK_d6d73cea8eedca8a556fa27fa0b"`
    )
    await queryRunner.query(
      `ALTER TABLE "shopping_cart_product" DROP CONSTRAINT "FK_d4d72b7092badd219e53ea001a7"`
    )
    await queryRunner.query(
      `ALTER TABLE "shopping_cart" DROP CONSTRAINT "FK_87ffac1cdd3ba18252b8e674880"`
    )
    await queryRunner.query(
      `ALTER TABLE "organization_member" DROP CONSTRAINT "FK_8e00ba39cecfd1607bd1aa1f185"`
    )
    await queryRunner.query(
      `ALTER TABLE "organization_member" DROP CONSTRAINT "FK_ce08825728e5afefdc6e682b8d7"`
    )
    await queryRunner.query(
      `ALTER TABLE "organization_member" DROP CONSTRAINT "FK_273aa659a4afdcb614cdecbd667"`
    )
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_907dff73c9b0e5b4ecd3afad3a9"`
    )
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_046d51ce4adb4d92dcc1791cabe"`
    )
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_0f31fe3925535afb5462326d7d6"`
    )
    await queryRunner.query(`ALTER TABLE "order" DROP CONSTRAINT "FK_199e32a02ddc0f47cd93181d8fd"`)
    await queryRunner.query(`ALTER TABLE "module" DROP CONSTRAINT "FK_9ceb34a8241471636decdbc6b34"`)
    await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_ddf30fb1ae714982dd23bd7fb57"`)
    await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_a9d7a581f3243f668fb3a2b34f9"`)
    await queryRunner.query(`ALTER TABLE "image" DROP CONSTRAINT "FK_e6a9e829e17fc47fc17d695af8e"`)
    await queryRunner.query(
      `ALTER TABLE "error_log" DROP CONSTRAINT "FK_d9051348e9b139ef51b0722d583"`
    )
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP CONSTRAINT "FK_b6ee8e5ebd8cc8e306a2fdcdd23"`
    )
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP CONSTRAINT "FK_17c09c6f7263bd9bd42f3bb1a4f"`
    )
    await queryRunner.query(
      `ALTER TABLE "email_template" DROP CONSTRAINT "FK_088f1c10d9eeedb83e06a3ecf0d"`
    )
    await queryRunner.query(
      `ALTER TABLE "document" DROP CONSTRAINT "FK_a24176a40152f41c98c09d8057d"`
    )
    await queryRunner.query(`ALTER TABLE "coupon" DROP CONSTRAINT "FK_05e2d1d174be912392277fc095c"`)
    await queryRunner.query(
      `ALTER TABLE "contact" DROP CONSTRAINT "FK_33d4fc93803e7192e150216fffb"`
    )
    await queryRunner.query(
      `ALTER TABLE "base_permission" DROP CONSTRAINT "FK_65d300fbbaa12d8ea18e075edc3"`
    )
    await queryRunner.query(
      `ALTER TABLE "base_permission" DROP CONSTRAINT "FK_94f7aa7d4e173bd0b03a9c546a5"`
    )
    await queryRunner.query(
      `ALTER TABLE "admission_proposal" DROP CONSTRAINT "FK_1dc74ec031daab6c629eeaf4314"`
    )
    await queryRunner.query(
      `ALTER TABLE "admission_proposal" DROP CONSTRAINT "FK_3c516725c41f3bb8b32fa127f56"`
    )
    await queryRunner.query(`DROP TABLE "address"`)
    await queryRunner.query(`DROP TABLE "user_permission"`)
    await queryRunner.query(`DROP TABLE "product_category"`)
    await queryRunner.query(`DROP TABLE "product"`)
    await queryRunner.query(`DROP TABLE "shopping_cart_product"`)
    await queryRunner.query(`DROP TABLE "shopping_cart"`)
    await queryRunner.query(`DROP TABLE "person"`)
    await queryRunner.query(`DROP TABLE "organization_member"`)
    await queryRunner.query(`DROP TABLE "organization"`)
    await queryRunner.query(`DROP TABLE "order"`)
    await queryRunner.query(`DROP TABLE "module"`)
    await queryRunner.query(`DROP TABLE "image"`)
    await queryRunner.query(`DROP TABLE "error_log"`)
    await queryRunner.query(`DROP TABLE "user"`)
    await queryRunner.query(`DROP INDEX "IDX_c90815fd4ca9119f1946220771"`)
    await queryRunner.query(`DROP TABLE "email_template"`)
    await queryRunner.query(`DROP TABLE "document"`)
    await queryRunner.query(`DROP TABLE "coupon"`)
    await queryRunner.query(`DROP TABLE "contact"`)
    await queryRunner.query(`DROP TABLE "base_permission"`)
    await queryRunner.query(`DROP TABLE "admission_proposal"`)
  }
}
