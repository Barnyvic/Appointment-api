import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddedSridsToCordinate1716815430936 implements MigrationInterface {
  name = 'AddedSridsToCordinate1716815430936';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ALTER COLUMN "coordinates" TYPE geometry(Point,4326)`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ALTER COLUMN "coordinates" TYPE geometry(POINT,0)`
    );
  }
}
