import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class Attendance_Daily extends Model {}

Attendance_Daily.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    school_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "school",
        key: "id",
      },
    },
    student_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "students",
        key: "id",
      },
    },
    attendance_date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    attendance_status_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "attendance_status",
        key: "id",
      },
    },
    source: {
      //either "manual" or "imported"
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Attendance_Daily",
    tableName: "attendance_daily",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ["student_id", "attendance_date"],
        unique: true,
      },
    ],
  }
);
