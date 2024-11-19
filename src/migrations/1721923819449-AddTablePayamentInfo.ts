import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTablePayamentInfo1721923819449 implements MigrationInterface {
  name = 'AddTablePayamentInfo1721923819449';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "paymentInformation" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "deletedAt" TIMESTAMP, "country" character varying(100) NOT NULL, "currencyType" character varying(50) NOT NULL, "bankName" character varying(100) NOT NULL, "accountNumber" character varying(100) NOT NULL, "businessProfileId" uuid, CONSTRAINT "REL_eef33413337d2f89cef3d86d00" UNIQUE ("businessProfileId"), CONSTRAINT "PK_e831fd16f9624a792b42259c47f" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "starRating"`);
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ADD "instagramLink" character varying(255)`
    );
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ADD "facebookLink" character varying(255)`
    );
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ADD "twitterLink" character varying(255)`
    );
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ADD "tiktokLink" character varying(255)`
    );
    await queryRunner.query(`ALTER TABLE "businessProfile" ADD "country" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "businessProfile" ADD "state" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "businessProfile" ADD "city" character varying(100)`);
    await queryRunner.query(`ALTER TABLE "businessProfile" ADD "zipCode" character varying(20)`);
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ADD "businessImage" character varying(255)`
    );
    await queryRunner.query(
      `ALTER TABLE "businessProfile" ADD "businessLogo" character varying(255)`
    );
    await queryRunner.query(
      `ALTER TABLE "paymentInformation" ADD CONSTRAINT "FK_eef33413337d2f89cef3d86d00d" FOREIGN KEY ("businessProfileId") REFERENCES "businessProfile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "paymentInformation" DROP CONSTRAINT "FK_eef33413337d2f89cef3d86d00d"`
    );
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "businessLogo"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "businessImage"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "zipCode"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "city"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "state"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "country"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "tiktokLink"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "twitterLink"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "facebookLink"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" DROP COLUMN "instagramLink"`);
    await queryRunner.query(`ALTER TABLE "businessProfile" ADD "starRating" integer`);
    await queryRunner.query(`DROP TABLE "paymentInformation"`);
  }
}
