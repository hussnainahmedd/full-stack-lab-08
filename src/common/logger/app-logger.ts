// common/logger/app-logger.ts - one abstract class, two implementations
import { Injectable } from '@nestjs/common';
import { appendFile, mkdir } from 'fs/promises';
import { join } from 'path';

// An abstract class exists at runtime, so it CAN be used as an injection token.
export abstract class AppLogger {
  abstract log(message: string): void;
}

@Injectable()
export class ConsoleAppLogger extends AppLogger {
  log(message: string): void {
    console.log(`[${new Date().toISOString()}] ${message}`);
  }
}

@Injectable()
export class FileAppLogger extends AppLogger {
  private readonly folder = join(process.cwd(), 'logs');

  log(message: string): void {
    const line = `[${new Date().toISOString()}] ${message}\n`;
    mkdir(this.folder, { recursive: true })
      .then(() => appendFile(join(this.folder, 'app.log'), line))
      .catch((error) => console.error('Could not write log:', error.message));
  }
}
