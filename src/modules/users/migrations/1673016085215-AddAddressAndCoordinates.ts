import { MigrationInterface, QueryRunner, TableColumn } from "typeorm"

export class AddAddressAndCoordinates1673016085215 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumns("user", [
            new TableColumn({name: "address", type: "varchar"}),
            new TableColumn({name: "coordinates", type: "point"})
        ])
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumns("user", ["address", "coordinates"])
    }

}
