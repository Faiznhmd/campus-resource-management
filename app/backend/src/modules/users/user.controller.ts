import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Req,
  Param,
  Delete,
  Get,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { AdminGuard } from '../auth/role.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // ⭐ Get logged-in user
  @Get('me')
  getMe(@Req() req) {
    return this.usersService.getUserById(req.user.id);
  }

  // ⭐ User updates themselves
  @Patch('me')
  updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(req.user.id, dto);
  }

  // ⭐ Admin updates any user
  @Patch(':id')
  @UseGuards(AdminGuard)
  updateAnyUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(Number(id), dto);
  }

  // ⭐ Admin deletes any user
  @Delete(':id')
  @UseGuards(AdminGuard)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }

  // ⭐ Admin gets all users
  @Get()
  @UseGuards(AdminGuard)
  getAllUsers() {
    return this.usersService.getAllUsers();
  }

  // ⭐ Admin toggles user active status (enable/disable)
  @Patch(':id/toggle-status')
  @UseGuards(AdminGuard)
  toggleStatus(@Param('id') id: string) {
    return this.usersService.toggleUserStatus(Number(id));
  }

  // ⭐ Admin gets specific user with details (optional - reuses existing method)
  @Get(':id')
  getUserById(@Param('id') id: string) {
    return this.usersService.getUserById(Number(id)); // ✅ FIXED
  }
}
