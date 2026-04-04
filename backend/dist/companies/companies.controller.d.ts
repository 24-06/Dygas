import { CompaniesService } from './companies.service';
export declare class CompaniesController {
    private readonly companiesService;
    constructor(companiesService: CompaniesService);
    findAll(): Promise<import("./company.entity").Company[]>;
    create(body: {
        name: string;
    }): Promise<import("./company.entity").Company>;
}
