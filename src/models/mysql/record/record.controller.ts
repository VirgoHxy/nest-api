import { FindManyOptionsDto } from '@dtos';
import { CustomValidationPipe } from '@middlewares';
import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { MysqlCustomRepository } from '../mysql.repository';
import { GetRecordsTestDto, RecordDto } from './record.dto';
import { Record } from './record.entity';
import { RecordService } from './record.service';

@Controller('records')
@ApiBearerAuth('authorization') //edit here
export class RecordController {
  constructor(
    private recordRepository: MysqlCustomRepository<Record>,
    // private recordRepository: RecordRepository,
    private recordService: RecordService,
  ) {}

  @ApiOperation({ summary: 'Return a list of records by opt' })
  @ApiResponse({
    status: 200,
    isArray: true,
    type: Record,
  })
  @Get('/')
  async find(
    @Query(new CustomValidationPipe()) opt?: FindManyOptionsDto<Record>,
  ): Promise<{ count: number; results: Record[] }> {
    const count = await this.recordRepository.count(opt);
    const results = await this.recordRepository.find(opt);
    return {
      count,
      results,
    };
  }

  @ApiOperation({ summary: 'Return a count number of records by where' })
  @ApiResponse({
    status: 200,
    type: Number,
  })
  @Get('/count')
  async count(@Query(new CustomValidationPipe(['find'])) where?: RecordDto): Promise<number> {
    const count = await this.recordRepository.countBy(where);
    return count;
  }

  @ApiOperation({ summary: 'Return a record by id' })
  @ApiResponse({
    status: 200,
    type: Record,
  })
  @Get('/:id')
  async findById(@Param('id', new ParseIntPipe()) id: number): Promise<Record> {
    await this.recordRepository.existOnlyOneOrFail(id);
    const result = await this.recordRepository.findOneBy({ id });
    return result;
  }

  @ApiOperation({ summary: 'Update a record by id' })
  @HttpCode(204)
  @Patch('/:id')
  async updateById(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new CustomValidationPipe(['update'])) body: RecordDto,
  ): Promise<null> {
    await this.recordRepository.existOnlyOneOrFail(id);
    await this.recordRepository.update(id, body);
    return null;
  }

  @ApiOperation({ summary: 'Delete a record by id' })
  @HttpCode(204)
  @Delete('/:id')
  async deleteById(@Param('id', new ParseIntPipe()) id: number): Promise<null> {
    await this.recordRepository.delete(id);
    return null;
  }

  @ApiOperation({ summary: 'Update a record by where' })
  @HttpCode(204)
  @Patch('/')
  async update(
    @Query(new CustomValidationPipe(['find'])) where: RecordDto,
    @Body(new CustomValidationPipe(['update'])) body: RecordDto,
  ): Promise<null> {
    await this.recordRepository.existOnlyOneOrFail(where);
    await this.recordRepository.update(where, body);
    return null;
  }

  @ApiOperation({ summary: 'Create a record' })
  @HttpCode(201)
  @Post('/')
  async create(@Body(new CustomValidationPipe(['create'])) body: RecordDto): Promise<string> {
    await this.recordRepository.insert(body);
    return 'OK';
  }

  @ApiOperation({ summary: 'Upsert records' })
  @HttpCode(204)
  @Post('/upsert')
  async upsert(@Body(new CustomValidationPipe(['upsert'], RecordDto)) body: RecordDto[]): Promise<null> {
    await this.recordRepository.save(body);
    return null;
  }

  // 下方仅是模拟业务需要
  @ApiOperation({ summary: 'Return a list of records by like' })
  @ApiResponse({
    status: 200,
    isArray: true,
    type: Record,
  })
  @Post('/getByLike')
  async getByLike(
    @Query(new CustomValidationPipe([], GetRecordsTestDto))
    query: GetRecordsTestDto,
  ): Promise<Record[]> {
    return this.recordService.getByLike(query);
  }

  @ApiOperation({ summary: 'Delete a record and create a record' })
  @ApiResponse({
    status: 200,
    type: String,
  })
  @Post('/deleteAndCreate/:id')
  async deleteAndCreate(
    @Param('id', new ParseIntPipe()) id: number,
    @Body(new CustomValidationPipe(['create'])) body: RecordDto,
  ): Promise<string> {
    await this.recordService.deleteAndCreate(id, body);
    return 'OK';
  }
}
