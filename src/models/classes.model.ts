import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

export class Class extends Model {}

Class.init(
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
    programId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "programs", // Name of the referenced model
        key: "id", // Key in the referenced model
      },
    },
    cte_schoolId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "cte_schools", // Name of the referenced model
        key: "id", // Key in the referenced model
      },
    },
    teacherId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "staff", // Name of the referenced model
        key: "id", // Key in the referenced model
      },
    },
  },
  {
    sequelize,
    modelName: "Class",
    tableName: "class",
    timestamps: true, // if you want createdAt and updatedAt fields
    underscored: true, // if you prefer snake_case for column names
  }
);
