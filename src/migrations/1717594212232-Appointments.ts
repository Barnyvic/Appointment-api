import { MigrationInterface, QueryRunner } from 'typeorm';

export class Appointments1717594212232 implements MigrationInterface {
  name = 'Appointments1717594212232';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "Appointment" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "appointmentDate" TIMESTAMP NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "notes" text, "isAvailable" boolean NOT NULL DEFAULT true, "customerId" uuid, "businessProfileId" uuid, "serviceDetailsId" uuid, CONSTRAINT "PK_b4c282a5c7803f8bd875bc6c4d5" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "Appointment" ADD CONSTRAINT "FK_cab354f301eff1b9d44bade9016" FOREIGN KEY ("customerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Appointment" ADD CONSTRAINT "FK_4244b38d4e8d333df807c6a243d" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "Appointment" ADD CONSTRAINT "FK_c7aacee076bccd42bc7e2e1b8c4" FOREIGN KEY ("serviceDetailsId") REFERENCES "service_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Appointment" DROP CONSTRAINT "FK_c7aacee076bccd42bc7e2e1b8c4"`
    );
    await queryRunner.query(
      `ALTER TABLE "Appointment" DROP CONSTRAINT "FK_4244b38d4e8d333df807c6a243d"`
    );
    await queryRunner.query(
      `ALTER TABLE "Appointment" DROP CONSTRAINT "FK_cab354f301eff1b9d44bade9016"`
    );
    await queryRunner.query(`DROP TABLE "Appointment"`);
  }
}
