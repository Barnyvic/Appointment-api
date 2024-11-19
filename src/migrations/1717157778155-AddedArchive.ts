import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedArchive1717157778155 implements MigrationInterface {
  name = 'AddedArchive1717157778155';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_details" ADD "isArchived" boolean NOT NULL DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "service_details" DROP COLUMN "isArchived"`);
  }
}
