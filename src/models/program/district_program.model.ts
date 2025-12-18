import { Model, DataTypes, Optional } from "sequelize";
import sequelize from "../../database";

export class District_Program extends Model {
  id!: number;
  district_id!: number;
  program_id!: number;
  authorization_date?: Date;
  expiration_date?: Date;
  active!: boolean;
}

District_Program.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    district_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "district",
        key: "id",
      },
    },
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "program_catalog",
        key: "id",
      },
    },
    authorization_date: {
      type: DataTypes.DATE,
    },
    expiration_date: {
      type: DataTypes.DATE,
    },
    active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    sequelize,
    modelName: "District_Program",
    tableName: "district_program",
    timestamps: false,
    underscored: true, // if you prefer snake_case for column names
  }
);
