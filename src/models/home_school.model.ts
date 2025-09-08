import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

export class HomeSchool extends Model {}

HomeSchool.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cteSchoolID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "school",
        key: "id",
      },

      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    schoolLocation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "HomeSchool",
    tableName: "home_school",
    timestamps: true,
    underscored: true, // if you prefer snake_case for column names
  }
);
