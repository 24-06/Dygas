import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from './user.entity';

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async onModuleInit() {
    await this.seedSuperAdmin();
  }

  private async seedSuperAdmin() {
    const existing = await this.usersRepository.findOne({
      where: { email: 'admin@dygas.com' },
    });
    if (!existing) {
      const hashed = await bcrypt.hash('Admin1234!', 10);
      const admin = this.usersRepository.create({
        name: 'Super Administrador',
        email: 'admin@dygas.com',
        password: hashed,
        role: UserRole.SUPER_ADMIN,
      });
      await this.usersRepository.save(admin);
      console.log('✅ SUPER_ADMIN creado: admin@dygas.com / Admin1234!');
    }
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({ select: ['id', 'name', 'email', 'role', 'companyId', 'createdAt'] });
  }

  async create(data: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    companyId?: number;
  }): Promise<User> {
    const hashed = await bcrypt.hash(data.password, 10);
    const user = this.usersRepository.create({ ...data, password: hashed });
    return this.usersRepository.save(user);
  }
}
