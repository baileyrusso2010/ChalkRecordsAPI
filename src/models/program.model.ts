import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

export class Program extends Model {}

Program.init(
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
    modelName: "Program",
    tableName: "programs",
    timestamps: true, // if you want createdAt and updatedAt fields
    underscored: true, // if you prefer snake_case for column names
  }
);
