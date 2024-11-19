import { MigrationInterface, QueryRunner } from 'typeorm';

export class ModifiedBookingHour1716539871281 implements MigrationInterface {
  name = 'ModifiedBookingHour1716539871281';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ALTER COLUMN "coordinates" TYPE geometry(Point)`
    );
    await queryRunner.query(`ALTER TABLE "booking_hours" ALTER COLUMN "day" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "booking_hours" ALTER COLUMN "from" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "booking_hours" ALTER COLUMN "to" DROP NOT NULL`);
    await queryRunner.query(`ALTER TABLE "booking_hours" ALTER COLUMN "isClosed" DROP NOT NULL`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "booking_hours" ALTER COLUMN "isClosed" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "booking_hours" ALTER COLUMN "to" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "booking_hours" ALTER COLUMN "from" SET NOT NULL`);
    await queryRunner.query(`ALTER TABLE "booking_hours" ALTER COLUMN "day" SET NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ALTER COLUMN "coordinates" TYPE geometry(POINT,0)`
    );
  }
}
