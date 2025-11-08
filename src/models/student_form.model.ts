import { DataTypes, Model } from "sequelize";
import sequelize from "../database";
import { defaultValueSchemable } from "sequelize/types/utils";

export class StudentForm extends Model {
  public student_id!: number;
  public form_id!: number;
}

StudentForm.init(
  {
    student_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "students",
        key: "id",
      },
    },
    form_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "form",
        key: "id",
      },
    },
    complete: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  },
  {
    sequelize,
    modelName: "StudentForm",
    tableName: "student_forms",
    timestamps: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["student_id", "form_id"],
      },
    ],
  }
);
