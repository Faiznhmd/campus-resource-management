import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
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
    if ((dto as any).password) {
      data.password = await bcrypt.hash((dto as any).password, 10);
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

  // ⭐ ADMIN Get All Users (includes isActive and bookings count)
  async getAllUsers() {
    return this.prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        _count: {
          select: { bookings: true },
        },
      },
    });
  }

  // New: Toggle user isActive (enable / disable)
  async toggleUserStatus(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    const updated = await this.prisma.user.update({
      where: { id },
      data: { isActive: !user.isActive },
      select: {
        id: true,
        isActive: true,
      },
    });

    return {
      message: `User ${updated.isActive ? 'enabled' : 'disabled'} successfully`,
      user: updated,
    };
  }

  async getUserById(id: number) {
    // FIX: Validate ID
    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid user ID');
    }

    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        bookings: {
          select: {
            id: true,
            resourceId: true,
            startTime: true,
            endTime: true,
            status: true,
            createdAt: true,
          },
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
}
