import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Req,
  UseGuards,
  BadRequestException,
} from '@nestjs/common';
import { BookingService } from './booking.service';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { CreateBookingDto } from 'src/user/dto/create-booking.dto';
import { AdminGuard } from '../auth/role.guard';

@Controller('bookings')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  // USER: CREATE BOOKING
  @UseGuards(JwtAuthGuard)
  @Post()
  createBooking(@Body() dto: CreateBookingDto, @Req() req: any) {
    const userId = req.user.id;
    return this.bookingService.createBooking(userId, dto);
  }

  // USER: MY BOOKINGS
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMyBookings(@Req() req: any) {
    return this.bookingService.getMyBookings(req.user.id);
  }

  // RESOURCE BOOKINGS (must be before ':id')
  @UseGuards(JwtAuthGuard)
  @Get('resource/:resourceId')
  getBookingsByResource(@Param('resourceId') resourceId: string) {
    const id = Number(resourceId);
    if (isNaN(id)) throw new BadRequestException('Invalid resourceId');

    return this.bookingService.getBookingsByResource(id);
  }

  // ADMIN: PENDING BOOKINGS
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get('pending')
  getPending() {
    return this.bookingService.getPendingBookings();
  }

  // ADMIN: APPROVE
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/approve')
  approve(@Param('id') id: string) {
    return this.bookingService.approveBooking(Number(id));
  }

  // ADMIN: REJECT
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Patch(':id/reject')
  reject(@Param('id') id: string) {
    return this.bookingService.rejectBooking(Number(id));
  }

  // ADMIN: GET ALL
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get()
  getAllBookings() {
    return this.bookingService.getAllBookings();
  }

  // ADMIN: GET BY ID
  @UseGuards(JwtAuthGuard, AdminGuard)
  @Get(':id')
  getBookingById(@Param('id') id: string) {
    return this.bookingService.getBookingById(Number(id));
  }
}
