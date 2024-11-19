import { MigrationInterface, QueryRunner } from 'typeorm';

export class ALterTableAppointmnetStatus1722512758062 implements MigrationInterface {
  name = 'ALterTableAppointmnetStatus1722512758062';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Appointment" ALTER COLUMN "status" SET DEFAULT 'PENDING'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Appointment" ALTER COLUMN "status" SET DEFAULT 'UPCOMING'`
    );
  }
}
