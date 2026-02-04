import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Evaluation_Cells extends Model {
    public id!: number
    public section_id!: number
    public row_id!: number
    public row_key!: string
    public column_id!: number
    public column_key!: string
    public student_id!: number
    public value_number!: number | null
    public value_text!: string | null
    public value_boolean!: boolean | null
}

Evaluation_Cells.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        document_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "evaluation_documents",
                key: "id",
            },
        },
        section_id: {
            //technically don't need this but makes "fetch all cells for a section" easier
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "evaluation_sections",
                key: "id",
            },
        },
        row_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "evaluation_section_rows",
                key: "id",
            },
        },
        row_key: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        column_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "evaluation_section_columns",
                key: "id",
            },
        },
        column_key: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "students",
                key: "id",
            },
        },
        value_number: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        value_text: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        value_boolean: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Evaluation_Cells",
        tableName: "evaluation_cells",
        timestamps: false,
        underscored: true,
        //add later
        // indexes: [
        //     {
        //         unique: true,
        //         fields: ["document_id", "section_id", "row_id", "column_id", "student_id"],
        //     },
        // ],
    },
)
