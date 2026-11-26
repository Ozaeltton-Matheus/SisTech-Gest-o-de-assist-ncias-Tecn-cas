import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableOsServico1795651362144 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS "os_servico" (
                "id_os" INTEGER NOT NULL,
                "id_servico" INTEGER NOT NULL,
                "quantidade" INTEGER NOT NULL DEFAULT 1,
                "preco_aplicado" DECIMAL(10,2) NOT NULL,
                PRIMARY KEY("id_os", "id_servico"),

                CONSTRAINT "fk_os_servico_ordem_servico"
                    FOREIGN KEY ("id_os")
                    REFERENCES "ordem_servico" ("id_os"),

                CONSTRAINT "fk_os_servico_servico"
                    FOREIGN KEY ("id_servico")
                    REFERENCES "servico" ("id_servico")
            );
        `)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DROP TABLE IF EXISTS "os_servico"
        `)
    }

}
