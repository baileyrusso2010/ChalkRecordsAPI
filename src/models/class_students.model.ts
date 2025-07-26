import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

export class ClassStudents extends Model {}

ClassStudents.init(
  {
    class_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Classes", // Name of the referenced model
        key: "id", // Key in the referenced model
      },
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Students", // Name of the referenced model
        key: "id", // Key in the referenced model
      },
    },
    school_year: {
      type: DataTypes.STRING,
      allowNull: false,
      // This field can be used to track the school year for the class-student association
    },
  },
  {
    sequelize,
    modelName: "ClassStudents",
    tableName: "class_students",
    timestamps: false, // if you want createdAt and updatedAt fields
    underscored: true, // if you prefer snake_case for column names
  }
);
