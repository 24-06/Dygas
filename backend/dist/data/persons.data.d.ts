export interface Person {
    id: number;
    documentNumber: string;
    documentType: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    departmentId: number;
    departmentName: string;
    municipalityId: number;
    municipalityName: string;
    stratum: number;
    serviceType: string;
    status: string;
    registrationDate: string;
}
export declare const PERSONS_DATA: Person[];
