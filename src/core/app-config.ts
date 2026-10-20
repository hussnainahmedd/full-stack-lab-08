// core/app-config.ts - application settings, shared through an injection token
import { join } from 'path';

// 1. A STRING token. Anything that needs the settings writes @Inject(APP_CONFIG)
export const APP_CONFIG = 'APP_CONFIG';

// 2. An interface describes the shape (interfaces vanish at runtime,
//    so they can be used as a TYPE but never as a token)
export interface AppConfig {
  appName: string;
  port: number;
  storage: 'file' | 'memory';
  dataFile: string;
}

// 3. The actual value
export const appConfig: AppConfig = {
  appName: 'Student API (NestJS)',
  port: Number(process.env.PORT) || 3000,
  storage: process.env.STORAGE === 'memory' ? 'memory' : 'file',
  dataFile: join(process.cwd(), 'data', 'students.json'),
};
