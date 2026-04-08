export declare class DepartmentsService {
    findAll(): {
        id: number;
        name: string;
        code: string;
        municipalityCount: number;
    }[];
    findMunicipalities(id: number): {
        departmentId: number;
        departmentName: string;
        municipalities: import("../data/colombia.data").Municipality[];
    };
}
