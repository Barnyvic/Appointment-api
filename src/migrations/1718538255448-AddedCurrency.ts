import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedCurrency1718538255448 implements MigrationInterface {
  name = 'AddedCurrency1718538255448';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_details" ADD "currency" character varying NOT NULL DEFAULT 'NGN'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "service_details" DROP COLUMN "currency"`);
  }
}
