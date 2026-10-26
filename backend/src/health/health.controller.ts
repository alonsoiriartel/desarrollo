import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  status() {
    return {
      status: 'ok',
      providers: (process.env.ENABLED_DATABASES || 'memory')
        .split(',').map(x => x.trim().toLowerCase()),
      note: 'Lista motores habilitados; no certifica conexión de cada base.',
    };
  }
}
