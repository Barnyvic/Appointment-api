import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBusinessDscription1723477004601 implements MigrationInterface {
  name = 'AddBusinessDscription1723477004601';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "businessProfile" ADD "description" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "description"`);
  }
}
