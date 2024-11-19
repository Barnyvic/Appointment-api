import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserAddress1713297058225 implements MigrationInterface {
  name = 'UserAddress1713297058225';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" ADD "address" text`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "address"`);
  }
}
