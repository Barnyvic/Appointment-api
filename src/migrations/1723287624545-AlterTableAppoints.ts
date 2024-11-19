import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableAppoints1723287624545 implements MigrationInterface {
  name = 'AlterTableAppoints1723287624545';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Appointment" ADD "reasonForCancellation" character varying`
    );
    await queryRunner.query(`ALTER TABLE "businessProfile" ADD "about" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "about"`);
    await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "reasonForCancellation"`);
  }
}
