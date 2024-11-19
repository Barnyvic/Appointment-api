import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserFmcTokenEntity1720510692425 implements MigrationInterface {
  name = 'UserFmcTokenEntity1720510692425';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_fcm_token" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid NOT NULL, "token" text NOT NULL, CONSTRAINT "UQ_cfd232159ca6c45c89aed75da4b" UNIQUE ("token"), CONSTRAINT "REL_43b35987d3493fefc50da8f1f1" UNIQUE ("userId"), CONSTRAINT "PK_89b95af80e4c7ec368d8397dba9" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "userFmcToken"`);
    await queryRunner.query(
      `ALTER TABLE "user_fcm_token" ADD CONSTRAINT "FK_43b35987d3493fefc50da8f1f15" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_fcm_token" DROP CONSTRAINT "FK_43b35987d3493fefc50da8f1f15"`
    );
    await queryRunner.query(`ALTER TABLE "user" ADD "userFmcToken" text`);
    await queryRunner.query(`DROP TABLE "user_fcm_token"`);
  }
}
