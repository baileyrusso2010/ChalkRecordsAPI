import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

export class CourseSubCourse extends Model {}

CourseSubCourse.init(
  {
    sub_course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "sub_course", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    course_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "course", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
  },
  {
    sequelize,
    modelName: "CourseSubCourse",
    tableName: "course_sub_course",
    timestamps: false,
    underscored: true, // if you prefer snake_case for column names
  }
);
