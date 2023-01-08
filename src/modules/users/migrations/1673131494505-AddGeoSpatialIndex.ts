import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGeoSpatialIndex1673131494505 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_951ade8ec3174b95b0e7e06248" ON "user" USING GiST ("coordinates") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_951ade8ec3174b95b0e7e06248"`);
    }

}
