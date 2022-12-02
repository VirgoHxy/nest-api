import { NotPackResult, Public } from '@decorators';
import { FindManyOptionsDto, FindOneOptionsDto } from '@dtos';
import { Controller, Get } from '@nestjs/common';
import { ApiExtraModels, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AppService } from './app.service';

@Public()
@NotPackResult()
// 显示公共的dto
@ApiExtraModels(FindManyOptionsDto, FindOneOptionsDto)
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @ApiOperation({ summary: 'Return OK' })
  @ApiResponse({ type: String })
  @Get('ping')
  ping(): string {
    return this.appService.ping();
  }
}
