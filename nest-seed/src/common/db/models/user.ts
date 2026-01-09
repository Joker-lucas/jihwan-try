import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Unique,
  DeletedAt,
  HasOne,
} from 'sequelize-typescript';
import type {
  CreationOptional,
  InferAttributes,
  InferCreationAttributes,
} from 'sequelize';
import { BasicCredential } from './basic-credential';

@Table({
  tableName: 'Users',
  timestamps: true,
  paranoid: true,
})
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  declare userId: CreationOptional<number>;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare contactEmail: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING)
  declare name: string;

  @HasOne(() => BasicCredential)
  declare basicCredential?: BasicCredential;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  @DeletedAt
  declare deletedAt: CreationOptional<Date | null>;
}
