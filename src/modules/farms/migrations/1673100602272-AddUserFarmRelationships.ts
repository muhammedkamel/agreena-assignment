import { MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddUserFarmRelationships1673100602272 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn("farm", new TableColumn({name: "userId", type: "uuid"}))
        await queryRunner.createForeignKey("farm", new TableForeignKey({columnNames: ["userId"], referencedTableName: "user", referencedColumnNames: ["id"], }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropForeignKey("farm", new TableForeignKey({columnNames: ["userId"], referencedTableName:"user", referencedColumnNames: ["id"]}))
        await queryRunner.dropColumn("farm", "userId")
    }

}
