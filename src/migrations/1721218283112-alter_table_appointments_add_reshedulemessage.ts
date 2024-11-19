import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableAppointmentsAddReshedulemessage1721218283112 implements MigrationInterface {
  name = 'AlterTableAppointmentsAddReshedulemessage1721218283112';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Appointment" ADD "rescheduleRequested" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(`ALTER TABLE "Appointment" ADD "rescheduleMessage" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "rescheduleMessage"`);
    await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "rescheduleRequested"`);
  }
}
