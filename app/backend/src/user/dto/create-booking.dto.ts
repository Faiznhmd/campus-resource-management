import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateBookingDto {
  @IsNotEmpty()
  @IsNumber()
  resourceId: number;

  @IsNotEmpty()
  @IsString()
  startTime: string; // e.g., "4pm"

  @IsNotEmpty()
  @IsString()
  endTime: string; // e.g., "6pm"
}
