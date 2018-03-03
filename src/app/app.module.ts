import { Module } from '@nestjs/common';
import { SharedModule } from '@shared/shared.module';
import { HelloWorldModule } from '@app/hello/helloworld.module';

@Module({
  imports: [SharedModule, HelloWorldModule],
})
export class AppModule {}
