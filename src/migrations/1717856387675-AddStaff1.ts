import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddStaff11717856387675 implements MigrationInterface {
  name = 'AddStaff11717856387675';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "staff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "firstName" character varying(50) NOT NULL, "lastName" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "phoneNumber" character varying(15), "businessProfileId" uuid, "userId" uuid, CONSTRAINT "PK_e4ee98bb552756c180aec1e854a" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "staff" ADD CONSTRAINT "FK_52c5a6ccf7c84a1d3c2230b0e8b" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "staff" ADD CONSTRAINT "FK_eba76c23bcfc9dad2479b7fd2ad" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_eba76c23bcfc9dad2479b7fd2ad"`);
    await queryRunner.query(`ALTER TABLE "staff" DROP CONSTRAINT "FK_52c5a6ccf7c84a1d3c2230b0e8b"`);
    await queryRunner.query(`DROP TABLE "staff"`);
  }
}
