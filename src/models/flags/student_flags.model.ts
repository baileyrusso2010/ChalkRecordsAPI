import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class StudentFlag extends Model {}

StudentFlag.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "student",
        key: "id",
      },
    },
    flag_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "flag",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "StudentFlag",
    tableName: "student_flags",
    timestamps: false, //add later,
    underscored: true,
  }
);
