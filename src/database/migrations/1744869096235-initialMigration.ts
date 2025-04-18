import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1744869096235 implements MigrationInterface {
    name = 'InitialMigration1744869096235'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`tokens\` (\`id\` varchar(255) NOT NULL, \`token\` varchar(255) NOT NULL, \`type\` enum ('verify-email', 'reset-password') NOT NULL, \`expires_at\` timestamp NOT NULL, \`user_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, UNIQUE INDEX \`IDX_6a8ca5961656d13c16c04079dd\` (\`token\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`admin\` (\`id\` varchar(255) NOT NULL, \`name\` varchar(255) NOT NULL, \`display_pic\` varchar(255) NULL, \`user_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, \`is_email_verified\` tinyint NOT NULL DEFAULT 0, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`user_profile\` (\`id\` varchar(255) NOT NULL, \`first_name\` varchar(255) NOT NULL, \`last_name\` varchar(255) NOT NULL, \`display_pic\` varchar(255) NULL, \`user_id\` varchar(255) NOT NULL, \`created_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updated_at\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`deleted_at\` datetime(6) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tokens\` ADD CONSTRAINT \`FK_8769073e38c365f315426554ca5\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`admin\` ADD CONSTRAINT \`FK_a28028ba709cd7e5053a86857b4\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`user_profile\` ADD CONSTRAINT \`FK_eee360f3bff24af1b6890765201\` FOREIGN KEY (\`user_id\`) REFERENCES \`users\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user_profile\` DROP FOREIGN KEY \`FK_eee360f3bff24af1b6890765201\``);
        await queryRunner.query(`ALTER TABLE \`admin\` DROP FOREIGN KEY \`FK_a28028ba709cd7e5053a86857b4\``);
        await queryRunner.query(`ALTER TABLE \`tokens\` DROP FOREIGN KEY \`FK_8769073e38c365f315426554ca5\``);
        await queryRunner.query(`DROP TABLE \`user_profile\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`admin\``);
        await queryRunner.query(`DROP INDEX \`IDX_6a8ca5961656d13c16c04079dd\` ON \`tokens\``);
        await queryRunner.query(`DROP TABLE \`tokens\``);
    }

}
