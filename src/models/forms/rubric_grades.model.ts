import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class Rubric_Grades extends Model {
  public id!: number;
}

Rubric_Grades.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    rubric_row_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "rubric_rows",
        key: "id",
      },
    },
    rubric_column_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "rubric_columns",
        key: "id",
      },
    },
    student_id: {
      type: DataTypes.INTEGER, //change later to ref
    },
    grade: {
      type: DataTypes.INTEGER,
    },
    comment: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Rubric_Grades",
    tableName: "rubric_grades",
    timestamps: false,
    underscored: true,
    indexes: [
      {
        unique: true,
        fields: ["student_id", "rubric_row_id", "rubric_column_id"],
        name: "unique_student_row_column_period",
      },
    ],
  }
);
// INSERT INTO form_static_fields (form_id, field_name, field_type) VALUES
// (1, 'exam_date', 'date'),
// (1, 'cut_score', 'number'),
// (1, 'earned_percent', 'number'),
// (1, 'passed', 'boolean'),
// (1, 'status', text');
