import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableReview1723547808532 implements MigrationInterface {
  name = 'AlterTableReview1723547808532';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "rating"`);
    await queryRunner.query(`ALTER TABLE "reviews" ADD "rating" numeric(2,1)`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "reviews" DROP COLUMN "rating"`);
    await queryRunner.query(`ALTER TABLE "reviews" ADD "rating" integer NOT NULL`);
  }
}
