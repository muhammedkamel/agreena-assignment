import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIndexes1673287426672 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE INDEX "IDX_11527b5b142bb3e07f87d45980" ON "farm" ("name") `);
        await queryRunner.query(`CREATE INDEX "IDX_7c100cd31250e4bb02be9481c6" ON "farm" ("yield") `);
        await queryRunner.query(`CREATE INDEX "IDX_5dcd8911195677c92a29951ed4" ON "farm" ("createdAt") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_5dcd8911195677c92a29951ed4"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7c100cd31250e4bb02be9481c6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_11527b5b142bb3e07f87d45980"`);
    }

}
