import { defineConfig, PostgreSqlDriver } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';

export default defineConfig({
  
  driver: PostgreSqlDriver,
  host: 'localhost',
  port: 5432,
  user: 'user',
  password: 'password',
  dbName: 'mydb',

  entities: ['dist/modules/**/*.entity.js'],
  entitiesTs: ['src/modules/**/*.entity.ts'],
  
  metadataProvider: TsMorphMetadataProvider,
  debug: true,
});

