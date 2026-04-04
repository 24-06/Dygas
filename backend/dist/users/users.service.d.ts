import { OnModuleInit } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User, UserRole } from './user.entity';
export declare class UsersService implements OnModuleInit {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    onModuleInit(): Promise<void>;
    private seedSuperAdmin;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
    create(data: {
        name: string;
        email: string;
        password: string;
        role: UserRole;
        companyId?: number;
    }): Promise<User>;
}
