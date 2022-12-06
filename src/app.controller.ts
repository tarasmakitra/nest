import { Controller, Get } from '@nestjs/common';
import { Public } from 'src/auth/decorators/public.decorator';
import { SeedService } from 'src/common/services/seed.service';

@Controller({
  version: '1',
})
export class AppController {
  constructor(private readonly seedService: SeedService) {}

  @Public()
  @Get('seed')
  async seed() {
    await this.seedService.seed();

    return { done: true };
  }
}
