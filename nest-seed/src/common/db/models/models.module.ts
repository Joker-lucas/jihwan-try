import { Module } from '@nestjs/common';
import { User } from './user';
import { BasicCredential } from './basic-credential';

const modelProviders = [
  {
    provide: 'USER_MODEL',
    useValue: User,
  },
  {
    provide: 'BASIC_CREDENTIAL_MODEL',
    useValue: BasicCredential,
  },
];

@Module({
  providers: [...modelProviders],
  exports: [...modelProviders],
})
export class ModelsModule {}
