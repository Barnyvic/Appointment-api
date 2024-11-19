import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserBusinessProfileRelation1718274887725 implements MigrationInterface {
  name = 'AddUserBusinessProfileRelation1718274887725';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_18db904c52a1713fa9663845e83"`);
    await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_18db904c52a1713fa9663845e83"`);
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "businessProfileId"`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "businessProfileId" uuid`);
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "UQ_18db904c52a1713fa9663845e83" UNIQUE ("businessProfileId")`
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_18db904c52a1713fa9663845e83" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }
}
