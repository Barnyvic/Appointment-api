import { MigrationInterface, QueryRunner } from 'typeorm';

export class BusinessUsersProfile1716294501756 implements MigrationInterface {
  name = 'BusinessUsersProfile1716294501756';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "service_details" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "serviceName" character varying(255) NOT NULL, "serviceType" character varying(255) NOT NULL, "timeHours" integer NOT NULL, "timeMinutes" integer NOT NULL, "amount" character varying(50) NOT NULL, "businessProfileId" uuid, CONSTRAINT "PK_848fa69403adf57a5e41d291ea8" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "booking_hours" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "day" character varying NOT NULL, "from" TIME NOT NULL, "to" TIME NOT NULL, "isClosed" boolean NOT NULL DEFAULT false, "businessProfileId" uuid, CONSTRAINT "PK_abdb6c4a7f654d62dd060f1cfd0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "businessUsersProfile" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "businessName" character varying(50) NOT NULL, "businessAddress" character varying(50) NOT NULL, "serviceOffering" text NOT NULL, "teamSize" character varying NOT NULL DEFAULT 'Just me', "businessCategory" character varying NOT NULL, CONSTRAINT "PK_0ff124ef7e3f73b1eb9b3bff2ea" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "businessProfileId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_18db904c52a1713fa9663845e83" UNIQUE ("businessProfileId")`
    );
    await queryRunner.query(
      `ALTER TABLE "service_details" ADD CONSTRAINT "FK_473244c9afcb4ba2bf8a8610cfa" FOREIGN KEY ("businessProfileId") REFERENCES "businessUsersProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "booking_hours" ADD CONSTRAINT "FK_7510f8e556d6680e5939a27594a" FOREIGN KEY ("businessProfileId") REFERENCES "businessUsersProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_18db904c52a1713fa9663845e83" FOREIGN KEY ("businessProfileId") REFERENCES "businessUsersProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
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
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_18db904c52a1713fa9663845e83"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "businessProfileId"`);
    await queryRunner.query(`DROP TABLE "businessUsersProfile"`);
    await queryRunner.query(`DROP TABLE "booking_hours"`);
    await queryRunner.query(`DROP TABLE "service_details"`);
  }
}
