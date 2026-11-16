
import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTipoUsuario1763300100000 implements MigrationInterface {
  name = 'AddTipoUsuario1763300100000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuario"
      ADD COLUMN "tipo_usuario" VARCHAR(50)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "usuario"
      DROP COLUMN "tipo_usuario"
    `);
  }
}
