import { DataTypes, Model } from "sequelize";
import sequelize from "../../database";

export class Form_Static_Values extends Model {}

Form_Static_Values.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    form_static_field: {
      type: DataTypes.INTEGER,

      allowNull: false,
      references: {
        model: "form_static_fields",
        key: "id",
      },
    },
    //    unique(form_static_field, student_id)
    student_id: {
      type: DataTypes.INTEGER,
      //references student later
    },
    value: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "Form_Static_Values",
    tableName: "form_static_values",
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

export default Form_Static_Values;
