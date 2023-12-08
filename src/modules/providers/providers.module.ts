import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AxioshttpService } from './services/http/axioshttp/axioshttp.service';

@Module({
  imports: [HttpModule],
  providers: [AxioshttpService],
  exports: [AxioshttpService],
})
export class ProvidersModule {}
