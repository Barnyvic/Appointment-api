import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAppointmnetStatus1717752103755 implements MigrationInterface {
  name = 'AddAppointmnetStatus1717752103755';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Appointment" ADD "status" character varying NOT NULL DEFAULT 'UPCOMING'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "status"`);
  }
}
