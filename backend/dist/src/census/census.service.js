"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CensusService = void 0;
const common_1 = require("@nestjs/common");
const persons_data_1 = require("../data/persons.data");
let CensusService = class CensusService {
    constructor() {
        this.censusRecords = [];
        this.nextId = 1;
    }
    verify(documentNumber) {
        const person = persons_data_1.PERSONS_DATA.find((p) => p.documentNumber === documentNumber);
        if (person)
            return { found: true, source: 'dygas', person };
        const record = [...this.censusRecords].reverse().find((r) => r.documentNumber === documentNumber);
        if (record) {
            const fromCensus = {
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
    findAll() {
        return this.censusRecords;
    }
    create(data) {
        const record = {
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
        const totalPersons = persons_data_1.PERSONS_DATA.length;
        const activePersons = persons_data_1.PERSONS_DATA.filter((p) => p.status === 'Activo').length;
        const inactivePersons = persons_data_1.PERSONS_DATA.filter((p) => p.status === 'Inactivo').length;
        const pendingPersons = persons_data_1.PERSONS_DATA.filter((p) => p.status === 'Pendiente').length;
        const totalCensus = this.censusRecords.length;
        const departmentsCovered = [...new Set(persons_data_1.PERSONS_DATA.map((p) => p.departmentId))].length;
        const gasNatural = persons_data_1.PERSONS_DATA.filter((p) => p.serviceType === 'Gas Natural').length;
        const gasLicuado = persons_data_1.PERSONS_DATA.filter((p) => p.serviceType === 'Gas Licuado').length;
        return { totalPersons, activePersons, inactivePersons, pendingPersons, totalCensus, departmentsCovered, gasNatural, gasLicuado };
    }
};
exports.CensusService = CensusService;
exports.CensusService = CensusService = __decorate([
    (0, common_1.Injectable)()
], CensusService);
//# sourceMappingURL=census.service.js.map