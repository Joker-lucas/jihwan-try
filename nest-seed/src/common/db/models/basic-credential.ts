import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { User } from './user';

@Table({
  tableName: 'BasicCredentials',
  timestamps: true,
})
export class BasicCredential extends Model<
  InferAttributes<BasicCredential>,
  InferCreationAttributes<BasicCredential>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare basicCredentialId: CreationOptional<number>;

  @AllowNull(false)
  @Unique
  @Column(DataType.STRING)
  declare loginEmail: string;

  @AllowNull(false)
  @Column(DataType.STRING)
  declare password: string;

  @ForeignKey(() => User)
  @AllowNull(false)
  @Unique
  @Column(DataType.INTEGER)
  declare userId: number;

  @BelongsTo(() => User)
  declare user?: User;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}
