import { MigrationInterface, QueryRunner } from "typeorm";

export class AddSpatialIndex1673142198063 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "coordinates"`);
        await queryRunner.query(`ALTER TABLE "farm" ADD "coordinates" geometry(Point,4326) NOT NULL`);
        await queryRunner.query(`CREATE INDEX "IDX_ce8ec32d62986bc2bc68126a2a" ON "farm" USING GiST ("coordinates") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_ce8ec32d62986bc2bc68126a2a"`);
        await queryRunner.query(`ALTER TABLE "farm" DROP COLUMN "coordinates"`);
        await queryRunner.query(`ALTER TABLE "farm" ADD "coordinates" point NOT NULL`);
    }

}
