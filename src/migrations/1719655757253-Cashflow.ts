import { MigrationInterface, QueryRunner } from 'typeorm';

export class Cashflow1719655757253 implements MigrationInterface {
  name = 'Cashflow1719655757253';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Income" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "amount" integer NOT NULL, "date" TIMESTAMP NOT NULL, "description" character varying NOT NULL, "businessProfileId" uuid, CONSTRAINT "PK_46dca1a56c759ce299680681968" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "expense" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "amount" integer NOT NULL, "date" TIMESTAMP NOT NULL, "description" character varying NOT NULL, "businessProfileId" uuid, CONSTRAINT "PK_edd925b450e13ea36197c9590fc" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "Income" ADD CONSTRAINT "FK_8f36e4ef203f08410dd4cb9d00c" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "expense" ADD CONSTRAINT "FK_aa23fa844f337fae831661598ad" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "expense" DROP CONSTRAINT "FK_aa23fa844f337fae831661598ad"`
    );
    await queryRunner.query(
      `ALTER TABLE "Income" DROP CONSTRAINT "FK_8f36e4ef203f08410dd4cb9d00c"`
    );
    await queryRunner.query(`DROP TABLE "expense"`);
    await queryRunner.query(`DROP TABLE "Income"`);
  }
}
