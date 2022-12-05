import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1670207565898 implements MigrationInterface {
    name = 'migration1670207565898'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`record\` ADD \`name\` varchar(20) NOT NULL COMMENT '名称'`);
        await queryRunner.query(`ALTER TABLE \`record\` ADD \`content\` varchar(100) NOT NULL COMMENT '记录内容'`);
        await queryRunner.query(`ALTER TABLE \`record\` ADD \`location\` varchar(50) NULL COMMENT '位置'`);
        await queryRunner.query(`ALTER TABLE \`record\` ADD \`create_time\` datetime(0) NOT NULL COMMENT '创建时间' DEFAULT CURRENT_TIMESTAMP(6)`);
        await queryRunner.query(`ALTER TABLE \`record\` ADD \`update_time\` datetime(0) NOT NULL COMMENT '更新时间' DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`record\` DROP COLUMN \`update_time\``);
        await queryRunner.query(`ALTER TABLE \`record\` DROP COLUMN \`create_time\``);
        await queryRunner.query(`ALTER TABLE \`record\` DROP COLUMN \`location\``);
        await queryRunner.query(`ALTER TABLE \`record\` DROP COLUMN \`content\``);
        await queryRunner.query(`ALTER TABLE \`record\` DROP COLUMN \`name\``);
    }

}
