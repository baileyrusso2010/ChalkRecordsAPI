import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

export class Flag extends Model {}

Flag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Flag",
    tableName: "flags",
    timestamps: false, // if you want createdAt and updatedAt fields
    underscored: true, // if you prefer snake_case for column names
  }
);
