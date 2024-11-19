import { MigrationInterface, QueryRunner } from 'typeorm';

export class CashflowEntityName1719906143870 implements MigrationInterface {
  name = 'CashflowEntityName1719906143870';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "cashflow" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(50) NOT NULL, "amount" integer NOT NULL, "date" TIMESTAMP NOT NULL, "description" character varying NOT NULL, "type" character varying NOT NULL DEFAULT 'INCOME', "businessProfileId" uuid, CONSTRAINT "PK_4cb64c5ef0ef3b8bee6d04bc488" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "cashflow" ADD CONSTRAINT "FK_ce9596c402c51e5b137c27b4bde" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cashflow" DROP CONSTRAINT "FK_ce9596c402c51e5b137c27b4bde"`
    );
    await queryRunner.query(`DROP TABLE "cashflow"`);
  }
}
