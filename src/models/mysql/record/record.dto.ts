import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmpty, IsInt, IsNotEmpty, IsOptional, IsString, NotEquals, ValidateIf } from 'class-validator';

export class RecordDto {
  @ApiPropertyOptional()
  @IsNotEmpty({ groups: ['findById'] })
  @IsEmpty({ groups: ['update', 'create'] })
  @NotEquals('', { groups: ['update', 'create'] })
  @IsOptional({ groups: ['upsert', 'find'] }) // 在upsert,find生效 如果缺失这个值 就忽略其他验证
  @IsInt()
  id: number;

  @ApiPropertyOptional()
  @IsNotEmpty({ groups: ['create'] })
  @IsOptional({ groups: ['update', 'upsert', 'find', 'findById'] })
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsNotEmpty({ groups: ['create'] })
  @IsOptional({ groups: ['update', 'upsert', 'find', 'findById'] })
  @IsString()
  content: string;

  @ApiPropertyOptional()
  @IsOptional({ always: true })
  @IsString()
  location?: string;
}

export class GetRecordsTestDto {
  @ApiPropertyOptional()
  @ValidateIf((_object, value) => value != undefined || value != '') // 自定义验证，如果条件false 则忽略其他验证
  @IsString()
  public content?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public name?: string;
}
