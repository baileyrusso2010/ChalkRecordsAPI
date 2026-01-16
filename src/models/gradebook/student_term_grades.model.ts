import { Model, DataTypes } from "sequelize";
import sequelize from "../../database";

export class Student_Term_Grades extends Model {}

Student_Term_Grades.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    enrollment_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "enrollments",
        key: "id",
      },
    },
    task_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "task",
        key: "id",
      },
    },
    numeric_score: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    letter_grade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    pass_fail: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Student_Term_Grades",
    tableName: "student_term_grades",
    timestamps: true,
    underscored: true, // if you prefer snake_case for column names
    indexes: [
      {
        unique: true,
        fields: ["enrollment_id", "task_id"],
      },
    ],
  }
);
