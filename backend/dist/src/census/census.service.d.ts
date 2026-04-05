import { Person } from '../data/persons.data';
export interface CensusRecord {
    id: number;
    documentNumber: string;
    personName: string;
    email: string;
    departmentName: string;
    municipalityName: string;
    serviceType: string;
    observations: string;
    agentName: string;
    createdAt: string;
}
export declare class CensusService {
    private censusRecords;
    private nextId;
    verify(documentNumber: string): {
        found: boolean;
        source?: string;
        person?: Person;
    };
    findAll(): CensusRecord[];
    create(data: Partial<CensusRecord>): CensusRecord;
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
}
