import { MigrationInterface, QueryRunner } from 'typeorm';

export class AssignedStaff1717858328274 implements MigrationInterface {
  name = 'AssignedStaff1717858328274';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Appointment" ADD "assignedStaffId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "Appointment" ADD CONSTRAINT "FK_f2c23d1767b1113da766863d666" FOREIGN KEY ("assignedStaffId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Appointment" DROP CONSTRAINT "FK_f2c23d1767b1113da766863d666"`
    );
    await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "assignedStaffId"`);
  }
}
