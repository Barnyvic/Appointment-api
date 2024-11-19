import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserFmcToken1720507969728 implements MigrationInterface {
  name = 'UserFmcToken1720507969728';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "notificationToken" TO "userFmcToken"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" RENAME COLUMN "userFmcToken" TO "notificationToken"`
    );
  }
}
