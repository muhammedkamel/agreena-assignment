import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeCoordinatesDataType1673134165588 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_951ade8ec3174b95b0e7e06248"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coordinates"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "coordinates" geometry(Point,4326) NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_951ade8ec3174b95b0e7e06248" ON "user" USING GiST ("coordinates") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_951ade8ec3174b95b0e7e06248"`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "coordinates"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "coordinates" point NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_951ade8ec3174b95b0e7e06248" ON "user" ("coordinates") `);
    }

}
