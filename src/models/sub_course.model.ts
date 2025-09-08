import { Model, DataTypes } from "sequelize";
import sequelize from "../database";

export class SubCourse extends Model {}

SubCourse.init(
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
    catalog_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "course_catalog", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    teacher_id: {
      //not sure if needed
      type: DataTypes.INTEGER,
      allowNull: true, // set false if required
      references: { model: "users", key: "id" },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    credits: {
      type: DataTypes.DECIMAL,
      allowNull: true, //change later
    },
  },
  {
    sequelize,
    modelName: "SubCourse",
    tableName: "sub_course",
    timestamps: false,
    underscored: true, // if you prefer snake_case for column names
  }
);
