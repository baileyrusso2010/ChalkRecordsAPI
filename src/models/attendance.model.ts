import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

export class Attendance extends Model {}

Attendance.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    absences: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default value for absences
    },
    absenses_excused: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default value for excused absences
    },
    absenses_unexcused: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default value for unexcused absences
    },
    tardies: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default value for tardies
    },
    tardies_excused: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default value for excused tardies
    },
    tardies_unexcused: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0, // Default value for unexcused tardies
    },
    school_year: {
      //maybe create school_year mode
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Attendance",
    tableName: "attendance",
    timestamps: false, // if you want createdAt and updatedAt fields
    underscored: true, // if you prefer snake_case for column names
  }
);
