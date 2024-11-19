import { MigrationInterface, QueryRunner } from 'typeorm';

export class OwnerMigration1718008772482 implements MigrationInterface {
  name = 'OwnerMigration1718008772482';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_18db904c52a1713fa9663845e83"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_18db904c52a1713fa9663845e83"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "businessProfileId"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" ADD "ownerId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ADD CONSTRAINT "FK_63e08a8929998be157391267a8e" FOREIGN KEY ("ownerId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "businessProfile" DROP CONSTRAINT "FK_63e08a8929998be157391267a8e"`
    );
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "ownerId"`);
    await queryRunner.query(`ALTER TABLE "user" ADD "businessProfileId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_18db904c52a1713fa9663845e83" UNIQUE ("businessProfileId")`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_18db904c52a1713fa9663845e83" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
