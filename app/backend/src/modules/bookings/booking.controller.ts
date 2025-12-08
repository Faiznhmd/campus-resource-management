import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CreateBookingDto } from 'src/user/dto/create-booking.dto';
import { AdminGuard } from '../auth/role.guard';

@Controller('bookings')
@UseGuards(JwtAuthGuard)
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // ⭐ User creates booking
  @Post()
  createBooking(@Body() dto: CreateBookingDto, @Req() req: any) {
    const userId = req.user.id ?? req.user.sub; // supports jwt payload variants
    return this.bookingService.createBooking(userId, dto);
  }

  // ⭐ User: Get my bookings
  @Get('me')
  getMyBookings(@Req() req: any) {
    const userId = req.user.id ?? req.user.sub;
    return this.bookingService.getMyBookings(userId);
  }

  // ⭐ Admin: Get pending booking requests
  @UseGuards(AdminGuard)
  @Get('pending')
  getPending() {
    return this.bookingService.getPendingBookings();
  }

  // ⭐ Admin: Approve booking
  @UseGuards(AdminGuard)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.bookingService.approveBooking(Number(id));
  }

  // ⭐ Admin: Reject booking
  @UseGuards(AdminGuard)
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.bookingService.rejectBooking(Number(id));
  }

  // ⭐ Admin: Get ALL bookings
  @UseGuards(AdminGuard)
  @Get()
  getAllBookings() {
    return this.bookingService.getAllBookings();
  }
}
