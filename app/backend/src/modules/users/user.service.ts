import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { UpdateUserDto } from '../../user/dto/update-user.dto';
import { AdminUpdateUserDto } from '../../user/dto/admin-update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}
  // ⭐ Update User (self or admin)
  async updateUser(userId: number, dto: UpdateUserDto | AdminUpdateUserDto) {
    // 1. Verify user exists
    const existing = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!existing) {
      throw new NotFoundException('User not found');
    }

    const data: any = { ...dto };

    // Hash password if updated
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data,
    });
  }

  // ⭐ ADMIN Delete User
  async deleteUser(id: number) {
    // 1. Validate user exists
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // 2. Hard Delete User
    return this.prisma.user.delete({
      where: { id },
    });
  }

  // ⭐ ADMIN Get All Users
  async getAllUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
