import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableAnnouncement1721158681760 implements MigrationInterface {
  name = 'CreateTableAnnouncement1721158681760';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "announcement" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "title" character varying(255) NOT NULL, "description" text NOT NULL, "publishDate" TIMESTAMP NOT NULL, "validUntil" TIMESTAMP, "images" text, "businessProfileId" uuid, CONSTRAINT "PK_e0ef0550174fd1099a308fd18a0" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `ALTER TABLE "announcement" ADD CONSTRAINT "FK_14f6ff9c4f1f9677833a3821e37" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "announcement" DROP CONSTRAINT "FK_14f6ff9c4f1f9677833a3821e37"`
    );
    await queryRunner.query(`DROP TABLE "announcement"`);
  }
}
