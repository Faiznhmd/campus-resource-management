import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Req,
  Param,
  Delete,
} from '@nestjs/common';
import { UsersService } from './user.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { AdminGuard } from '../auth/role.guard';
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  //only user can edit ourself
  @Patch('me')
  updateMe(@Req() req, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(req.user.id, dto);
  }

  // ADMIN updates any user by ID
  @Patch(':id')
  @UseGuards(AdminGuard)
  updateAnyUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.updateUser(Number(id), dto);
  }
  //admin delete user
  @Delete(':id')
  @UseGuards(AdminGuard)
  deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(Number(id));
  }
}
