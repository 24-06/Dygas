import { Injectable } from '@nestjs/common';
import { COLOMBIA_DATA } from '../data/colombia.data';

@Injectable()
export class DepartmentsService {
  findAll() {
    return COLOMBIA_DATA.map(({ id, name, code, municipalities }) => ({
      id,
      name,
      code,
      municipalityCount: municipalities.length,
    }));
  }

  findMunicipalities(id: number) {
    const dept = COLOMBIA_DATA.find((d) => d.id === id);
    if (!dept) return null;
    return {
      departmentId: dept.id,
      departmentName: dept.name,
      municipalities: dept.municipalities,
    };
  }
}
