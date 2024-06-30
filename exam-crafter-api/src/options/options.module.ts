import { Module } from '@nestjs/common';
import { OptionsService } from './options.service';
import { OptionsController } from './options.controller';
import { OptionsSchema } from './entities/option.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Option', schema: OptionsSchema }]),
  ],
  controllers: [OptionsController],
  providers: [OptionsService],
})
export class OptionsModule {}
