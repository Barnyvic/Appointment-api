import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCurrencyToBusiness1724830448665 implements MigrationInterface {
  name = 'AddCurrencyToBusiness1724830448665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ADD "businessCurrency" character varying NOT NULL DEFAULT 'NGN'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "businessCurrency"`);
  }
}
