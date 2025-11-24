import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class WBL_Hours extends Model {
  public id!: number;
  public student_id!: number; // Foreign key to Student
  public hours!: number;
  public comments!: string;
}

WBL_Hours.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    student_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "students", // name of Target model
        key: "id", // key in Target model that we're referencing
      },
    },
    catagory_id: {
      type: DataTypes.INTEGER,
      references: {
        model: "wbl_catagories", // name of Target model
        key: "id", // key in Target model that we're referencing
      },
    },
    hours: {
      type: DataTypes.FLOAT,
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "WBL_Hours",
    tableName: "wbl_hours",
    timestamps: false,
    underscored: true,
  }
);
