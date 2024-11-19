import { MigrationInterface, QueryRunner } from 'typeorm';

export class Availability1717603332072 implements MigrationInterface {
  name = 'Availability1717603332072';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "availability" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "date" date NOT NULL, "startTime" TIME NOT NULL, "endTime" TIME NOT NULL, "interval" integer NOT NULL, "businessProfileId" uuid, "serviceId" uuid, CONSTRAINT "PK_05a8158cf1112294b1c86e7f1d3" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "availability" ADD CONSTRAINT "FK_aeba37e7342aa1c1c522f91e015" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "availability" ADD CONSTRAINT "FK_b46e737810f0d746b3843580a51" FOREIGN KEY ("serviceId") REFERENCES "service_details"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "availability" DROP CONSTRAINT "FK_b46e737810f0d746b3843580a51"`
    );
    await queryRunner.query(
      `ALTER TABLE "availability" DROP CONSTRAINT "FK_aeba37e7342aa1c1c522f91e015"`
    );
    await queryRunner.query(`DROP TABLE "availability"`);
  }
}
