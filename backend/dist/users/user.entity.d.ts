import { Company } from '../companies/company.entity';
export declare enum UserRole {
    SUPER_ADMIN = "SUPER_ADMIN",
    JEFE = "JEFE",
    EMPLEADO = "EMPLEADO"
}
export declare class User {
    id: number;
    name: string;
    email: string;
    password: string;
    role: UserRole;
    companyId: number;
    company: Company;
    createdAt: Date;
}
