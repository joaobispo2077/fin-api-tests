import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTransferTypeIntoStatement1633186476908
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE IF EXISTS transaction_type_old`);
    await queryRunner.query(`DROP TYPE IF EXISTS transaction_type`);

    await queryRunner.query(
      `CREATE TYPE "transaction_type" AS ENUM('deposit', 'withdraw', 'transfer')`
    );

    await queryRunner.query(
      `CREATE TYPE "transaction_type_old" AS ENUM('deposit', 'withdraw')`
    );

    await queryRunner.query(
      `ALTER TABLE "statements" ALTER COLUMN "type" TYPE "transaction_type" USING type::text::"transaction_type" `
    );

    await queryRunner.query(`DROP TYPE IF EXISTS transaction_type_old`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TYPE IF EXISTS transaction_type_old`);
    await queryRunner.query(`DROP TYPE IF EXISTS transaction_type`);

    await queryRunner.query(
      `CREATE TYPE "transaction_type" AS ENUM('deposit', 'withdraw', 'transfer')`
    );

    await queryRunner.query(
      `CREATE TYPE "transaction_type_old" AS ENUM('deposit', 'withdraw')`
    );

    await queryRunner.query(
      `ALTER TABLE "statements" ALTER COLUMN "type" TYPE "transaction_type_old" USING type::text::"transaction_type_old" `
    );

    await queryRunner.query(`DROP TYPE IF EXISTS transaction_type_old`);
  }
}
