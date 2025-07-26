import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

export class Student extends Model {}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true, // Ensure student_id is unique
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
    },
    dateOfBirth: {
      type: DataTypes.DATE,
      allowNull: true, // Optional field
    },
    schoolDistrictId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional field
      references: {
        model: "school_districts", // Name of the referenced table
        key: "id", // Key in the referenced model
      },
    },
    cteSchoolId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional field
      references: {
        model: "cte_schools", // Name of the referenced table
        key: "id", // Key in the referenced model
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
    },
    race: {
      type: DataTypes.STRING,
      allowNull: true, // Optional field
    },
    hispanic: {
      type: DataTypes.BOOLEAN,
      allowNull: true, // Optional field
    },
    counslorId: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional field
      references: {
        model: "staff", // Name of the referenced table
        key: "id", // Key in the referenced model
      },
    },
  },
  {
    sequelize,
    modelName: "Student",
    tableName: "students",
    timestamps: true, // if you want createdAt and updatedAt fields
    underscored: true, // if you prefer snake_case for column names
  }
);
