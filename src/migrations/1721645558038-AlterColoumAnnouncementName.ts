import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterColoumAnnouncementName1721645558038 implements MigrationInterface {
  name = 'AlterColoumAnnouncementName1721645558038';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "announcement" ALTER COLUMN "publishDate" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "announcement" ALTER COLUMN "publishDate" SET NOT NULL`);
  }
}
