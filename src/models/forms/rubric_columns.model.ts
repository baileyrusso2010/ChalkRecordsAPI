import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class Rubric_Columns extends Model {
  public id!: number;
}

Rubric_Columns.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rubric_section_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "rubric_sections",
        key: "id",
      },
    },
    label: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Rubric_Columns",
    tableName: "rubric_columns",
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
