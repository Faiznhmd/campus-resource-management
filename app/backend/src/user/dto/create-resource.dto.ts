// src/modules/resource/dto/create-resource.dto.ts

import {
  IsString,
  IsOptional,
  IsBoolean,
  IsInt,
  IsEnum,
} from 'class-validator';
import { Status } from '@prisma/client';

export class CreateResourceDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsInt()
  maxDuration?: number;

  @IsOptional()
  @IsBoolean()
  requiresApproval?: boolean;
}
