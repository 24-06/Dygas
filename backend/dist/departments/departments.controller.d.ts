import { DepartmentsService } from './departments.service';
export declare class DepartmentsController {
    private readonly service;
    constructor(service: DepartmentsService);
    findAll(): {
        id: number;
        name: string;
        code: string;
        municipalityCount: number;
    }[];
    findMunicipalities(id: string): {
        departmentId: number;
        departmentName: string;
        municipalities: import("../data/colombia.data").Municipality[];
    };
}
