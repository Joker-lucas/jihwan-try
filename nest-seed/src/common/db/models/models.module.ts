import { Module } from '@nestjs/common';
import { User } from './user';

const modelProviders = [
  {
    provide: 'USER_MODEL',
    useValue: User,
  },
];

@Module({
  providers: [...modelProviders],
  exports: [...modelProviders],
})
export class ModelsModule {}
