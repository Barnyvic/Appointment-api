import { MigrationInterface, QueryRunner } from 'typeorm';

export class Transactions1723469079813 implements MigrationInterface {
  name = 'Transactions1723469079813';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "transaction" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "amount" numeric(10,2) NOT NULL, "transactionRef" character varying(255) NOT NULL, "email" character varying(255) NOT NULL, "status" character varying NOT NULL DEFAULT 'PENDING', "metadata" text, "userId" uuid NOT NULL, CONSTRAINT "PK_89eadb93a89810556e1cbcd6ab9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_605baeb040ff0fae995404cea37" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_605baeb040ff0fae995404cea37"`
    );
    await queryRunner.query(`DROP TABLE "transaction"`);
  }
}
