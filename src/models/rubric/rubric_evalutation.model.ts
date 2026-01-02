import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class Rubric_Evaluation extends Model {}

Rubric_Evaluation.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rubric_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "rubric",
        key: "id",
      },
    },
  },
  {
    sequelize,
    modelName: "Rubric_Evaluation",
    tableName: "rubric_evaluation",
    timestamps: true,
    underscored: true,
  }
);
