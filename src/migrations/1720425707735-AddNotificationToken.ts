import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNotificationToken1720425707735 implements MigrationInterface {
  name = 'AddNotificationToken1720425707735';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "notificationToken" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "notificationToken"`);
  }
}
