// fees/fees-info.controller.ts - proves the useExisting alias works
import { Controller, Get, Inject } from '@nestjs/common';
import { FeesService } from './fees.service';

@Controller('api/fees')
export class FeesInfoController {
  // 'FEE_CALCULATOR' is an alias for FeesService (useExisting in the module):
  // this controller receives the very same FeesService instance.
  constructor(@Inject('FEE_CALCULATOR') private readonly fees: FeesService) {}

  // Must stay reachable before ":rollNumber", otherwise "info" is a roll number
  @Get('info')
  info() {
    return this.fees.info();
  }
}
