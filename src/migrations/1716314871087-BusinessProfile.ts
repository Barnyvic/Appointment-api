import { MigrationInterface, QueryRunner } from 'typeorm';

export class BusinessProfile1716314871087 implements MigrationInterface {
  name = 'BusinessProfile1716314871087';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "booking_hours" ALTER COLUMN "day" SET DEFAULT '{"MONDAY":"Monday","TUESDAY":"Tuesday","WEDNESDAY":"Wednesday","THURSDAY":"Thursday","FRIDAY":"Friday","SATURDAY":"Saturday","SUNDAY":"Sunday"}'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "booking_hours" ALTER COLUMN "day" DROP DEFAULT`);
  }
}
