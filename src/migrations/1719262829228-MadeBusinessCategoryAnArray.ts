import { MigrationInterface, QueryRunner } from 'typeorm';

export class MadeBusinessCategoryAnArray1719262829228 implements MigrationInterface {
  name = 'MadeBusinessCategoryAnArray1719262829228';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "businessCategory"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" ADD "businessCategory" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "businessCategory"`);
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ADD "businessCategory" character varying NOT NULL`
    );
  }
}
