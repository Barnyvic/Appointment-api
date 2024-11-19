import { MigrationInterface, QueryRunner } from 'typeorm';

export class ALterTableAppointementAddCustomersDetailAndEmail1722344617141
  implements MigrationInterface
{
  name = 'ALterTableAppointementAddCustomersDetailAndEmail1722344617141';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Appointment" ADD "customerName" character varying`);
    await queryRunner.query(`ALTER TABLE "Appointment" ADD "customerEmail" character varying`);
    await queryRunner.query(
      `ALTER TABLE "Appointment" ADD "customerPhoneNumber" character varying`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "customerPhoneNumber"`);
    await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "customerEmail"`);
    await queryRunner.query(`ALTER TABLE "Appointment" DROP COLUMN "customerName"`);
  }
}
