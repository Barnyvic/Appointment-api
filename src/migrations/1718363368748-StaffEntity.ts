import { MigrationInterface, QueryRunner } from 'typeorm';

export class StaffEntity1718363368748 implements MigrationInterface {
  name = 'StaffEntity1718363368748';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "firstName"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "lastName"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "email"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP COLUMN "phoneNumber"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "staff" ADD "phoneNumber" character varying(15)`);
    await queryRunner.query(`ALTER TABLE "staff" ADD "email" character varying(100) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "staff" ADD "lastName" character varying(50) NOT NULL`);
    await queryRunner.query(`ALTER TABLE "staff" ADD "firstName" character varying(50) NOT NULL`);
  }
}
