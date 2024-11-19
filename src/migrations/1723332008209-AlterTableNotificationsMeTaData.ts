import { MigrationInterface, QueryRunner } from 'typeorm';

export class AlterTableNotificationsMeTaData1723332008209 implements MigrationInterface {
  name = 'AlterTableNotificationsMeTaData1723332008209';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "notification" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "userId" uuid NOT NULL, "title" text NOT NULL, "content" text, "image" text, "type" character varying NOT NULL, "metadata" text NOT NULL DEFAULT '[]', "staffId" uuid, "appointmentId" uuid, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_1ced25315eb974b73391fb1c81b" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_431561c3b765dc6470a83065f3b" FOREIGN KEY ("staffId") REFERENCES "staff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" ADD CONSTRAINT "FK_d2d676e2bce3164a0b017e91adf" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_d2d676e2bce3164a0b017e91adf"`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_431561c3b765dc6470a83065f3b"`
    );
    await queryRunner.query(
      `ALTER TABLE "notification" DROP CONSTRAINT "FK_1ced25315eb974b73391fb1c81b"`
    );
    await queryRunner.query(`DROP TABLE "notification"`);
  }
}
