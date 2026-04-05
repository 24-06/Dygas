import { CensusService } from './census.service';
export declare class CensusController {
    private readonly service;
    constructor(service: CensusService);
    verify(document: string): {
        found: boolean;
        source?: string;
        person?: import("../data/persons.data").Person;
    };
    getStats(): {
        totalPersons: number;
        activePersons: number;
        inactivePersons: number;
        pendingPersons: number;
        totalCensus: number;
        departmentsCovered: number;
        gasNatural: number;
        gasLicuado: number;
    };
    findAll(): import("./census.service").CensusRecord[];
    create(body: any): import("./census.service").CensusRecord;
}
