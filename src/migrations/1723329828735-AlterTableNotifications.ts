import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableNotifications1723329828735 implements MigrationInterface {
  name = 'AlterTableNotifications1723329828735';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "metadata"`);
    await queryRunner.query(`ALTER TABLE "notification" ADD "metadata" json`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "metadata"`);
    await queryRunner.query(`ALTER TABLE "notification" ADD "metadata" text NOT NULL DEFAULT '[]'`);
  }
}
