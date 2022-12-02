import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDate, IsInt, IsString } from 'class-validator';
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@Entity()
export class Record {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  @IsInt()
  id: number;

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 20,
    comment: '名称',
    nullable: false,
  })
  @IsString()
  name: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: 100,
    comment: '记录内容',
    nullable: false,
  })
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @Column({
    type: 'varchar',
    length: 50,
    comment: '位置',
    nullable: true,
  })
  @IsString()
  location?: string;

  @ApiProperty()
  @CreateDateColumn({
    name: 'create_time',
    type: 'datetime',
    comment: '创建时间',
    nullable: false,
    precision: 0,
  })
  @IsDate()
  createTime: string;

  @ApiProperty()
  @UpdateDateColumn({
    name: 'update_time',
    type: 'datetime',
    comment: '更新时间',
    nullable: false,
    precision: 0,
  })
  @IsDate()
  updateTime: string;
}
