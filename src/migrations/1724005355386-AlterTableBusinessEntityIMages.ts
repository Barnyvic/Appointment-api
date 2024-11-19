import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableBusinessEntityIMages1724005355386 implements MigrationInterface {
  name = 'AlterTableBusinessEntityIMages1724005355386';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "businessImage"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" ADD "businessImage" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "businessImage"`);
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ADD "businessImage" character varying(255)`
    );
  }
}
