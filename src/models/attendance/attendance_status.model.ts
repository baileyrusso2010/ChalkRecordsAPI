import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class Attendance_Status extends Model {}

Attendance_Status.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    code: {
      type: DataTypes.CHAR(2), //2 b/c of unique cases but could expand
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Attendance_Status",
    tableName: "attendance_status",
    timestamps: false,
    underscored: true,
  }
);
