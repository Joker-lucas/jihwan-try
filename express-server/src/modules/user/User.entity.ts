import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class User {
   @PrimaryKey()
   id!: number;

   @Property()
   fullName!: string;

   @Property({ unique: true })
   email!: string;

   @Property()
   password!: string; 

   @Property({ type: 'text', nullable: true })
   bio?: string;
}
