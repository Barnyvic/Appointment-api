import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedServiceToStaff1718979252174 implements MigrationInterface {
  name = 'AddedServiceToStaff1718979252174';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "staff_services_service_details" ("staffId" uuid NOT NULL, "serviceDetailsId" uuid NOT NULL, CONSTRAINT "PK_b5cdeba1c3edfadf6573a0ff169" PRIMARY KEY ("staffId", "serviceDetailsId"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_37ea057803e75388ca9ae80a77" ON "staff_services_service_details" ("staffId") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_12ad78815184c39fcf9cf5be7f" ON "staff_services_service_details" ("serviceDetailsId") `
    );
    await queryRunner.query(`ALTER TABLE "service_details" ADD "image" text`);
    await queryRunner.query(
      `ALTER TABLE "staff_services_service_details" ADD CONSTRAINT "FK_37ea057803e75388ca9ae80a776" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "staff_services_service_details" ADD CONSTRAINT "FK_12ad78815184c39fcf9cf5be7f0" FOREIGN KEY ("serviceDetailsId") REFERENCES "service_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "staff_services_service_details" DROP CONSTRAINT "FK_12ad78815184c39fcf9cf5be7f0"`
    );
    await queryRunner.query(
      `ALTER TABLE "staff_services_service_details" DROP CONSTRAINT "FK_37ea057803e75388ca9ae80a776"`
    );
    await queryRunner.query(`ALTER TABLE "service_details" DROP COLUMN "image"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_12ad78815184c39fcf9cf5be7f"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_37ea057803e75388ca9ae80a77"`);
    await queryRunner.query(`DROP TABLE "staff_services_service_details"`);
  }
}
