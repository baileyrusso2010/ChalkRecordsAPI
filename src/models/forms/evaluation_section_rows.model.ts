import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Evaluation_Section_Rows extends Model {
    public id!: number
    public section_id!: string
    public key!: string
    public label!: string
    public description!: string
    public row_type!: string
}

Evaluation_Section_Rows.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        section_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "evaluation_sections",
                key: "id",
            },
        },
        key: {
            // "cdos_performances, cdoes_technical, assessments"
            type: DataTypes.STRING,
            allowNull: false,
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        row_type: {
            type: DataTypes.STRING, //skill, exam
            allowNull: false,
        },
        //sort
        //order
    },
    {
        sequelize,
        modelName: "Evaluation_Section_Rows",
        tableName: "evaluation_section_rows",
        timestamps: false,
        underscored: true,
    },
)
