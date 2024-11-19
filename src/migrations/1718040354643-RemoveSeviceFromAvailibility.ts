import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveSeviceFromAvailibility1718040354643 implements MigrationInterface {
  name = 'RemoveSeviceFromAvailibility1718040354643';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "availability" DROP CONSTRAINT "FK_b46e737810f0d746b3843580a51"`
    );
    await queryRunner.query(`ALTER TABLE "availability" DROP COLUMN "serviceId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "availability" ADD "serviceId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "availability" ADD CONSTRAINT "FK_b46e737810f0d746b3843580a51" FOREIGN KEY ("serviceId") REFERENCES "service_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
