
import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsuario1763300000000 implements MigrationInterface {
  name = 'CreateUsuario1763300000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "usuario" (
        "id_usuario" SERIAL NOT NULL,
        "email" VARCHAR(150) NOT NULL,
        "senha" VARCHAR(255) NOT NULL,
        "tipo_usuario" VARCHAR(50) NOT NULL,
        "ativo" BOOLEAN NOT NULL DEFAULT true,
        CONSTRAINT "PK_usuario" PRIMARY KEY ("id_usuario"),
        CONSTRAINT "UQ_usuario_email" UNIQUE ("email")
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "usuario"`);
  }
}
