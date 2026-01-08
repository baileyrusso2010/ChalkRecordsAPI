import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class RiskWeight extends Model {
  public id!: number;
  public driver!: string;
  public weight!: number;
}

RiskWeight.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    driver: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    weight: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "RiskWeight",
    tableName: "risk_weights",
    timestamps: false,
    underscored: true,
  }
);
