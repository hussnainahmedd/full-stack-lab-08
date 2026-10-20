// fees/fees.controller.ts - routes only; the work is done by the service
import { Controller, Get, Param, Query } from '@nestjs/common';
import { RollNumberParamDto } from '../students/dto/roll-number-param.dto';
import { FeeQueryDto } from './dto/fee-query.dto';
import { FeesService } from './fees.service';

@Controller('api/fees')
export class FeesController {
  // Nest sees the parameter type and injects the FeesService instance
  constructor(private readonly feesService: FeesService) {}

  @Get(':rollNumber')
  feeFor(@Param() params: RollNumberParamDto, @Query() query: FeeQueryDto) {
    return this.feesService.feeFor(params.rollNumber, query.creditHours);
  }
}
