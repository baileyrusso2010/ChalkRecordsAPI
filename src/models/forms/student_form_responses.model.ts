import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class StudentFormResponses extends Model {
  public form_id!: number;
  public student_id!: number;
  public responses!: object;
}

StudentFormResponses.init(
  {
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "form",
        key: "id",
      },
    },
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "students",
        key: "id",
      },
    },
    responses: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "StudentFormResponses",
    tableName: "student_form_responses",
    timestamps: true,
    underscored: true,
  }
);
