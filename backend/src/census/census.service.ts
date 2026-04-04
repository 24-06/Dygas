import { Injectable } from '@nestjs/common';
import { PERSONS_DATA, Person } from '../data/persons.data';

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

@Injectable()
export class CensusService {
  private censusRecords: CensusRecord[] = [];
  private nextId = 1;

  verify(documentNumber: string): { found: boolean; source?: string; person?: Person } {
    // 1. Buscar en clientes registrados DYGAS
    const person = PERSONS_DATA.find((p) => p.documentNumber === documentNumber);
    if (person) return { found: true, source: 'dygas', person };

    // 2. Buscar en registros del censo creados por el agente
    const record = [...this.censusRecords].reverse().find((r) => r.documentNumber === documentNumber);
    if (record) {
      const fromCensus: Person = {
        id: 0,
        documentNumber: record.documentNumber,
        documentType: 'CC',
        firstName: record.personName.split(' ')[0] || record.personName,
        lastName: record.personName.split(' ').slice(1).join(' ') || '',
        phone: '',
        email: '',
        address: '',
        departmentId: 0,
        departmentName: record.departmentName,
        municipalityId: 0,
        municipalityName: record.municipalityName,
        stratum: 0,
        serviceType: record.serviceType,
        status: 'Registrado',
        registrationDate: record.createdAt.split('T')[0],
      };
      return { found: true, source: 'census', person: fromCensus };
    }

    return { found: false };
  }

  findAll(): CensusRecord[] {
    return this.censusRecords;
  }

  create(data: Partial<CensusRecord>): CensusRecord {
    const record: CensusRecord = {
      id: this.nextId++,
      documentNumber: data.documentNumber || '',
      personName: data.personName || '',
      email: data.email || '',
      departmentName: data.departmentName || '',
      municipalityName: data.municipalityName || '',
      serviceType: data.serviceType || '',
      observations: data.observations || '',
      agentName: data.agentName || 'Agente',
      createdAt: new Date().toISOString(),
    };
    this.censusRecords.push(record);
    return record;
  }

  getStats() {
    const totalPersons = PERSONS_DATA.length;
    const activePersons = PERSONS_DATA.filter((p) => p.status === 'Activo').length;
    const inactivePersons = PERSONS_DATA.filter((p) => p.status === 'Inactivo').length;
    const pendingPersons = PERSONS_DATA.filter((p) => p.status === 'Pendiente').length;
    const totalCensus = this.censusRecords.length;
    const departmentsCovered = [...new Set(PERSONS_DATA.map((p) => p.departmentId))].length;
    const gasNatural = PERSONS_DATA.filter((p) => p.serviceType === 'Gas Natural').length;
    const gasLicuado = PERSONS_DATA.filter((p) => p.serviceType === 'Gas Licuado').length;

    return { totalPersons, activePersons, inactivePersons, pendingPersons, totalCensus, departmentsCovered, gasNatural, gasLicuado };
  }
}
