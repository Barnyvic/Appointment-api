import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableBusinessEntity1723916771477 implements MigrationInterface {
  name = 'AlterTableBusinessEntity1723916771477';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "businessAddress"`);
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ADD "businessAddress" character varying(100)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "businessAddress"`);
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ADD "businessAddress" character varying(50) NOT NULL`
    );
  }
}
