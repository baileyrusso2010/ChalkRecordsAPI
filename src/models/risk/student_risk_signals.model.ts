import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class StudentRiskSignal extends Model {
  public id!: number;
  public student_id!: number;
  public driver!: string;
  public score!: number;
  public trend!: number;
  public model_version!: string;
}

StudentRiskSignal.init(
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
        model: "students",
        key: "id",
      },
    },
    driver: {
      type: DataTypes.STRING, //behavior attendance grades?
      allowNull: false,
    },
    score: {
      type: DataTypes.INTEGER, //0-100
      allowNull: false,
    },
    trend: {
      type: DataTypes.SMALLINT, // -1, 0, 1
      allowNull: false,
    },
    model_version: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    calculated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "StudentRiskSignal",
    tableName: "student_risk_signals",
    timestamps: false,
    underscored: true,
  }
);
