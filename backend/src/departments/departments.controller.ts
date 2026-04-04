import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { DepartmentsService } from './departments.service';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly service: DepartmentsService) {}

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id/municipalities')
  findMunicipalities(@Param('id') id: string) {
    const result = this.service.findMunicipalities(+id);
    if (!result) throw new NotFoundException(`Departamento con id ${id} no encontrado`);
    return result;
  }
}
