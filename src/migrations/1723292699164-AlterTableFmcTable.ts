import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableFmcTable1723292699164 implements MigrationInterface {
  name = 'AlterTableFmcTable1723292699164';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_fcm_token" DROP CONSTRAINT "UQ_cfd232159ca6c45c89aed75da4b"`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_fcm_token" ADD CONSTRAINT "UQ_cfd232159ca6c45c89aed75da4b" UNIQUE ("token")`
    );
  }
}
