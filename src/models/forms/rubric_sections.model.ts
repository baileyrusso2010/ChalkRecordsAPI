import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class Rubric_Sections extends Model {
  public id!: number;
  public name!: string;
  public description?: string;
}

Rubric_Sections.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    form_id: {
      type: DataTypes.INTEGER,

      allowNull: false,
      references: {
        model: "form",
        key: "id",
      },
    },
    name: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Rubric_Sections",
    tableName: "rubric_sections",
    timestamps: false,
    underscored: true,
  }
);
// INSERT INTO form_static_fields (form_id, field_name, field_type) VALUES
// (1, 'exam_date', 'date'),
// (1, 'cut_score', 'number'),
// (1, 'earned_percent', 'number'),
// (1, 'passed', 'boolean'),
// (1, 'status', 'text');
