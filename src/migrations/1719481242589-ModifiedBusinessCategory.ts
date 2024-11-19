import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifiedBusinessCategory1719481242589 implements MigrationInterface {
  name = 'ModifiedBusinessCategory1719481242589';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "businessCategory"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" ADD "businessCategory" text array`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "businessCategory"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" ADD "businessCategory" text`);
  }
}
