import { MigrationInterface, QueryRunner } from 'typeorm';

export class TransactionServiceEntity1725483492532 implements MigrationInterface {
  name = 'TransactionServiceEntity1725483492532';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_785d50ccaf5cce8d70c34f6ff26"`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" RENAME COLUMN "businessProfileId" TO "serviceDetailsId"`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_5d8497fc17ebfb6709bf8080850" FOREIGN KEY ("serviceDetailsId") REFERENCES "service_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "transaction" DROP CONSTRAINT "FK_5d8497fc17ebfb6709bf8080850"`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" RENAME COLUMN "serviceDetailsId" TO "businessProfileId"`
    );
    await queryRunner.query(
      `ALTER TABLE "transaction" ADD CONSTRAINT "FK_785d50ccaf5cce8d70c34f6ff26" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
