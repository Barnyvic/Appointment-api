import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedStaffToAvailability1718040011832 implements MigrationInterface {
  name = 'AddedStaffToAvailability1718040011832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "businessProfile" DROP CONSTRAINT "FK_63e08a8929998be157391267a8e"`
    );
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "ownerId"`);
    await queryRunner.query(`ALTER TABLE "availability" ADD "staffId" uuid`);
    await queryRunner.query(`ALTER TABLE "notification" ADD "staffId" uuid`);
    await queryRunner.query(`ALTER TABLE "notification" ADD "appointmentId" uuid`);
    await queryRunner.query(`ALTER TABLE "user" ADD "businessProfileId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_18db904c52a1713fa9663845e83" UNIQUE ("businessProfileId")`
    );
    await queryRunner.query(
      `ALTER TABLE "availability" ADD CONSTRAINT "FK_92a1cfd52ca192e7087f5dd101a" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_431561c3b765dc6470a83065f3b" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_d2d676e2bce3164a0b017e91adf" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_18db904c52a1713fa9663845e83" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_18db904c52a1713fa9663845e83"`);
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_d2d676e2bce3164a0b017e91adf"`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_431561c3b765dc6470a83065f3b"`
    );
    await queryRunner.query(
      `ALTER TABLE "availability" DROP CONSTRAINT "FK_92a1cfd52ca192e7087f5dd101a"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_18db904c52a1713fa9663845e83"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "businessProfileId"`);
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "appointmentId"`);
    await queryRunner.query(`ALTER TABLE "notification" DROP COLUMN "staffId"`);
    await queryRunner.query(`ALTER TABLE "availability" DROP COLUMN "staffId"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" ADD "ownerId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ADD CONSTRAINT "FK_63e08a8929998be157391267a8e" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
