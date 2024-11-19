import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableService1723036913800 implements MigrationInterface {
  name = 'AlterTableService1723036913800';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "service_details" ADD "description" character varying(255)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "service_details" DROP COLUMN "description"`);
  }
}
