import {
  Controller, Get, Post, Body, UseGuards, Request, ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from './user.entity';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.JEFE)
  findAll() {
    return this.usersService.findAll();
  }

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.JEFE)
  async create(@Body() body: any, @Request() req: any) {
    const requester: UserRole = req.user.role;
    // SUPER_ADMIN puede crear JEFE y EMPLEADO; JEFE solo puede crear EMPLEADO
    if (requester === UserRole.JEFE && body.role !== UserRole.EMPLEADO) {
      throw new ForbiddenException('Un JEFE solo puede crear usuarios EMPLEADO');
    }
    return this.usersService.create(body);
  }
}
