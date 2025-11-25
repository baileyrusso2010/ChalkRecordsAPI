import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class Form_Static_Fields extends Model {
  public id!: number;
  public rubric_section_id!: number;
  public field_name!: string;
  public field_type!: string;
  public category?: string;
}

Form_Static_Fields.init(
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
    field_name: {
      type: DataTypes.STRING,
    },
    field_type: {
      type: DataTypes.STRING, //like boolean date number
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Form_Static_Fields",
    tableName: "form_static_fields",
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

export default Form_Static_Fields;
