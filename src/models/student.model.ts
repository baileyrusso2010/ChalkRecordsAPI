import { DataTypes, Model } from "sequelize";
import sequelize from "../database";
import { Form } from "./forms/form.model";

export class Student extends Model {
  public id!: number;
  public first_name!: string;
  public last_name!: string;
  public student_id!: string;
  public grade!: string;
  public gender?: string;
  public age!: number;
  public school_id!: number;
  public forms?: Form[];
}

Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    student_id: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    grade: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    gender: {
      type: DataTypes.STRING,
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: "school",
          key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Student",
    tableName: "students",
    timestamps: false,
    underscored: true,
  }
);
