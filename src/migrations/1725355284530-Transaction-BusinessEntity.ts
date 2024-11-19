import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionBusinessEntity1725355284530 implements MigrationInterface {
  name = 'TransactionBusinessEntity1725355284530';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "transaction" ADD "businessProfileId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_785d50ccaf5cce8d70c34f6ff26" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_785d50ccaf5cce8d70c34f6ff26"`
    );
    await queryRunner.query(`ALTER TABLE "transaction" DROP COLUMN "businessProfileId"`);
  }
}
