import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags, ApiParam } from '@nestjs/swagger';
import type { Response } from 'express';
import { ProverbsService } from './proverbs.service';

@ApiTags('Proverbs')
@Controller('proverbs')
export class ProverbsController {
  constructor(private readonly proverbsService: ProverbsService) {}

  @Get()
  @ApiOperation({ summary: 'List proverbs with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  findAll(@Query('page') page: string, @Query('limit') limit: string) {
    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 20;
    return this.proverbsService.findAll(pageNumber, limitNumber);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search proverbs by text or translations' })
  @ApiQuery({ name: 'q', required: true, type: String, example: 'wisdom' })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  search(@Query('q') query: string, @Query('limit') limit: string) {
    const limitNumber = parseInt(limit, 10) || 20;
    return this.proverbsService.search(query, limitNumber);
  }

  @Get('ids')
  @ApiOperation({ summary: 'List all proverb ids with update timestamps' })
  ids(@Res({ passthrough: true }) res: Response) {
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return this.proverbsService.ids();
  }

  @Get('random')
  @ApiOperation({ summary: 'Get a random proverb' })
  random() {
    return this.proverbsService.random();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a proverb by ID' })
  @ApiParam({ name: 'id', type: Number })
  findOne(@Param('id') id: string) {
    const proverb = this.proverbsService.findOne(parseInt(id));
    if (!proverb) throw new NotFoundException(`Proverb ${id} not found`);
    return proverb;
  }
}
