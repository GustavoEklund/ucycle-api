import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddPermissions1656615116783 implements MigrationInterface {
  name = 'AddPermissions1656615116783'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "base_permission_status_enum" AS ENUM('GRANTED', 'REVOKED')`
    )
    await queryRunner.query(
      `CREATE TABLE "base_permission" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "code" character varying(100) NOT NULL,
        "name" character varying(256) NOT NULL,
        "description" character varying(256),
        "read" boolean NOT NULL DEFAULT false,
        "write" boolean NOT NULL DEFAULT false,
        "owner" boolean NOT NULL DEFAULT false,
        "status" "base_permission_status_enum" NOT NULL,
        "expires_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "module_id" uuid NOT NULL,
        "created_by" uuid,
        CONSTRAINT "UQ_466d8a3c63f858f4b3ba4cd263c" UNIQUE ("code"),
        CONSTRAINT "PK_407dfc97728bbbf8b46fea6f9cc" PRIMARY KEY ("id")
      );
      COMMENT ON COLUMN "base_permission"."id" IS 'the base permission id, in uuid format';
      COMMENT ON COLUMN "base_permission"."code" IS 'the unique code to identify the permission';
      COMMENT ON COLUMN "base_permission"."name" IS 'the name of the permission';
      COMMENT ON COLUMN "base_permission"."description" IS 'the description of the permission';
      COMMENT ON COLUMN "base_permission"."read" IS 'if has read permission';
      COMMENT ON COLUMN "base_permission"."write" IS 'if has write permission';
      COMMENT ON COLUMN "base_permission"."owner" IS 'if has owner permission';
      COMMENT ON COLUMN "base_permission"."status" IS 'the permission status can be either GRANTED or REVOKED';
      COMMENT ON COLUMN "base_permission"."expires_at" IS 'the date when the permission expires';
      COMMENT ON COLUMN "base_permission"."created_at" IS 'the date when the permission was created';
      COMMENT ON COLUMN "base_permission"."updated_at" IS 'the date when the permission was updated last time';
      COMMENT ON COLUMN "base_permission"."deleted_at" IS 'the date when the permission was deleted'`
    )
    await queryRunner.query(
      `CREATE TABLE "module" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "deletedAt" TIMESTAMP,
        "createdById" uuid,
        CONSTRAINT "PK_0e20d657f968b051e674fbe3117" PRIMARY KEY ("id")
      )`
    )
    await queryRunner.query(
      `CREATE TYPE "user_permission_status_enum" AS ENUM('GRANTED', 'REVOKED')`
    )
    await queryRunner.query(
      `CREATE TABLE "user_permission" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "code" character varying(100) NOT NULL,
        "name" character varying(256) NOT NULL,
        "description" character varying(256),
        "read" boolean NOT NULL DEFAULT false,
        "write" boolean NOT NULL DEFAULT false,
        "owner" boolean NOT NULL DEFAULT false,
        "status" "user_permission_status_enum" NOT NULL,
        "expires_at" TIMESTAMP,
        "created_at" TIMESTAMP NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
        "deleted_at" TIMESTAMP,
        "module_id" uuid NOT NULL,
        "created_by_user_id" uuid NOT NULL,
        "grant_to_user_id" uuid NOT NULL,
        "grant_at_organization_id" uuid NOT NULL,
        CONSTRAINT "UQ_eb1841f5c2964e96aea5cbf7bee" UNIQUE ("code"),
        CONSTRAINT "PK_a7326749e773c740a7104634a77" PRIMARY KEY ("id")
      );
      COMMENT ON COLUMN "user_permission"."id" IS 'the user permission id, in uuid format';
      COMMENT ON COLUMN "user_permission"."code" IS 'the code to identify the permission, comes from base permission';
      COMMENT ON COLUMN "user_permission"."name" IS 'the name of the permission';
      COMMENT ON COLUMN "user_permission"."description" IS 'the description of the permission';
      COMMENT ON COLUMN "user_permission"."read" IS 'if has read permission';
      COMMENT ON COLUMN "user_permission"."write" IS 'if has write permission';
      COMMENT ON COLUMN "user_permission"."owner" IS 'if has owner permission';
      COMMENT ON COLUMN "user_permission"."status" IS 'the permission status can be either GRANTED or REVOKED';
      COMMENT ON COLUMN "user_permission"."expires_at" IS 'the date when the permission expires';
      COMMENT ON COLUMN "user_permission"."created_at" IS 'the date when the permission was created';
      COMMENT ON COLUMN "user_permission"."updated_at" IS 'the date when the permission was updated last time';
      COMMENT ON COLUMN "user_permission"."deleted_at" IS 'the date when the permission was deleted'`
    )
    await queryRunner.query(`ALTER TABLE "organization" ADD "userPermissionsId" uuid`)
    await queryRunner.query(
      `COMMENT ON COLUMN "organization"."userPermissionsId" IS 'the user permission id, in uuid format'`
    )
    await queryRunner.query(
      `ALTER TABLE "organization"
        ADD CONSTRAINT "FK_80954ad748656161b93eff4bf60"
          FOREIGN KEY ("userPermissionsId") REFERENCES "user_permission"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "base_permission"
        ADD CONSTRAINT "FK_94f7aa7d4e173bd0b03a9c546a5"
          FOREIGN KEY ("module_id") REFERENCES "module"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "base_permission"
        ADD CONSTRAINT "FK_65d300fbbaa12d8ea18e075edc3"
          FOREIGN KEY ("created_by") REFERENCES "user"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "module"
        ADD CONSTRAINT "FK_fbeb33741f6bce1eaf629e49023"
          FOREIGN KEY ("createdById") REFERENCES "user"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_permission"
        ADD CONSTRAINT "FK_4784ffd727837739af684f95681"
          FOREIGN KEY ("module_id") REFERENCES "module"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_permission"
        ADD CONSTRAINT "FK_1e633a454da67f13836fd2e813b"
          FOREIGN KEY ("created_by_user_id") REFERENCES "user"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_permission"
        ADD CONSTRAINT "FK_3c9d9c512a4718eac3770ee82fe"
            FOREIGN KEY ("grant_to_user_id") REFERENCES "user"("id")
                ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
    await queryRunner.query(
      `ALTER TABLE "user_permission"
        ADD CONSTRAINT "FK_7675b0b1bfc3d9f39e24a9bc0a7"
          FOREIGN KEY ("grant_at_organization_id") REFERENCES "organization"("id")
            ON DELETE NO ACTION ON UPDATE NO ACTION`
    )
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
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
    await queryRunner.query(`ALTER TABLE "module" DROP CONSTRAINT "FK_fbeb33741f6bce1eaf629e49023"`)
    await queryRunner.query(
      `ALTER TABLE "base_permission" DROP CONSTRAINT "FK_65d300fbbaa12d8ea18e075edc3"`
    )
    await queryRunner.query(
      `ALTER TABLE "base_permission" DROP CONSTRAINT "FK_94f7aa7d4e173bd0b03a9c546a5"`
    )
    await queryRunner.query(
      `ALTER TABLE "organization" DROP CONSTRAINT "FK_80954ad748656161b93eff4bf60"`
    )
    await queryRunner.query(
      `COMMENT ON COLUMN "organization"."userPermissionsId" IS 'the user permission id, in uuid format'`
    )
    await queryRunner.query(`ALTER TABLE "organization" DROP COLUMN "userPermissionsId"`)
    await queryRunner.query(`DROP TABLE "user_permission"`)
    await queryRunner.query(`DROP TYPE "user_permission_status_enum"`)
    await queryRunner.query(`DROP TABLE "module"`)
    await queryRunner.query(`DROP TABLE "base_permission"`)
    await queryRunner.query(`DROP TYPE "base_permission_status_enum"`)
  }
}
