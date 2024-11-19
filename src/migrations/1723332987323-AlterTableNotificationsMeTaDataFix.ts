import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableNotificationsMeTaDataFix1723332987323 implements MigrationInterface {
  name = 'AlterTableNotificationsMeTaDataFix1723332987323';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "metadata"`);
    await queryRunner.query(`ALTER TABLE "notification" ADD "metadata" json`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "metadata"`);
    await queryRunner.query(`ALTER TABLE "notification" ADD "metadata" text NOT NULL DEFAULT '[]'`);
  }
}
