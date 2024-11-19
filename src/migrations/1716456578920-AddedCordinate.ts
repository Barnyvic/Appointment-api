import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCordinate1716456578920 implements MigrationInterface {
  name = 'AddedCordinate1716456578920';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_details" DROP CONSTRAINT "FK_473244c9afcb4ba2bf8a8610cfa"`
    );
    await queryRunner.query(
      `ALTER TABLE "booking_hours" DROP CONSTRAINT "FK_7510f8e556d6680e5939a27594a"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_18db904c52a1713fa9663845e83"`);
    await queryRunner.query(
      `CREATE TABLE "businessProfile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "businessName" character varying(50) NOT NULL, "businessAddress" character varying(50) NOT NULL, "serviceOffering" text NOT NULL, "teamSize" character varying NOT NULL DEFAULT 'Just me', "businessCategory" character varying NOT NULL, "starRating" integer, "coordinates" geometry(Point), CONSTRAINT "PK_0609f51d10a1a2b3d4fbea5018a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c730f439c3bcfa4dd7e85db100" ON "businessProfile" USING GiST ("coordinates") `
    );
    await queryRunner.query(
      `ALTER TABLE "service_details" ADD CONSTRAINT "FK_473244c9afcb4ba2bf8a8610cfa" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "booking_hours" ADD CONSTRAINT "FK_7510f8e556d6680e5939a27594a" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_18db904c52a1713fa9663845e83" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_18db904c52a1713fa9663845e83"`);
    await queryRunner.query(
      `ALTER TABLE "booking_hours" DROP CONSTRAINT "FK_7510f8e556d6680e5939a27594a"`
    );
    await queryRunner.query(
      `ALTER TABLE "service_details" DROP CONSTRAINT "FK_473244c9afcb4ba2bf8a8610cfa"`
    );
    await queryRunner.query(`DROP INDEX "public"."IDX_c730f439c3bcfa4dd7e85db100"`);
    await queryRunner.query(`DROP TABLE "businessProfile"`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_18db904c52a1713fa9663845e83" FOREIGN KEY ("businessProfileId") REFERENCES "businessUsersProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "booking_hours" ADD CONSTRAINT "FK_7510f8e556d6680e5939a27594a" FOREIGN KEY ("businessProfileId") REFERENCES "businessUsersProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "service_details" ADD CONSTRAINT "FK_473244c9afcb4ba2bf8a8610cfa" FOREIGN KEY ("businessProfileId") REFERENCES "businessUsersProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
