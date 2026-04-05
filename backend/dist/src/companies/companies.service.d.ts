import { Repository } from 'typeorm';
import { Company } from './company.entity';
export declare class CompaniesService {
    private companiesRepository;
    constructor(companiesRepository: Repository<Company>);
    findAll(): Promise<Company[]>;
    create(data: {
        name: string;
    }): Promise<Company>;
}
