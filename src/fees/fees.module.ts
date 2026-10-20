// fees/fees.module.ts - wires the providers together
import { Module } from '@nestjs/common';
import { AppLogger } from '../common/logger/app-logger';
import { StudentsModule } from '../students/students.module';
import {
  FEE_POLICY, FEE_RATE, FeePolicy, MeritFeePolicy, StandardFeePolicy,
} from './fee-policy';
import { FeesInfoController } from './fees-info.controller';
import { FeesController } from './fees.controller';
import { FeesService } from './fees.service';

@Module({
  // StudentsModule exports StudentsService, so FeesService can inject it
  imports: [StudentsModule],
  // FeesInfoController first: its "info" route must win over ":rollNumber"
  controllers: [FeesInfoController, FeesController],
  providers: [
    FeesService,

    // useValue: provide a ready-made value
    { provide: FEE_RATE, useValue: 5000 },

    // useFactory: pick the policy object from the environment at startup.
    // Swapping the policy never touches FeesService.
    {
      provide: FEE_POLICY,
      useFactory: (rate: number, logger: AppLogger): FeePolicy => {
        const name = process.env.FEE_POLICY === 'merit' ? 'merit' : 'standard';
        logger.log(`Using ${name} fee policy`);
        return name === 'merit' ? new MeritFeePolicy() : new StandardFeePolicy();
      },
      inject: [FEE_RATE, AppLogger],
    },

    // useExisting: a second name for the SAME FeesService instance
    { provide: 'FEE_CALCULATOR', useExisting: FeesService },
  ],
})
export class FeesModule {}
