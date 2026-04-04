import { Controller, Get, Param, Post, Body } from '@nestjs/common';
import { CensusService } from './census.service';

@Controller('census')
export class CensusController {
  constructor(private readonly service: CensusService) {}

  @Get('verify/:document')
  verify(@Param('document') document: string) {
    return this.service.verify(document);
  }

  @Get('stats')
  getStats() {
    return this.service.getStats();
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Post()
  create(@Body() body: any) {
    return this.service.create(body);
  }
}
