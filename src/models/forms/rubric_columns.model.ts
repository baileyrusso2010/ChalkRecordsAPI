import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export enum ColumnType {
    TEXT = "text",
    NUMBER = "number",
    DATE = "date",
    BOOLEAN = "boolean", // Checkbox
    TEXTAREA = "textarea",
    SELECT = "select", // Dropdown
}

export class Rubric_Columns extends Model {
    public id!: number
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
        type: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: ColumnType.TEXT, // Safe default
            validate: {
                isIn: [Object.values(ColumnType)],
            },
            comment:
                "Tells the frontend which input component to render (e.g., date picker vs text box)",
        },
        order: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
            comment: "Determines the display order of columns left-right",
        },
        //put type of column like date, string etc
    },
    {
        sequelize,
        modelName: "Rubric_Columns",
        tableName: "rubric_columns",
        timestamps: false,
        underscored: true,
    }
)
// INSERT INTO form_static_fields (form_id, field_name, field_type) VALUES
// (1, 'exam_date', 'date'),
// (1, 'cut_score', 'number'),
// (1, 'earned_percent', 'number'),
// (1, 'passed', 'boolean'),
// (1, 'status', 'text');
