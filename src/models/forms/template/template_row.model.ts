import { DataTypes, Model } from "sequelize"
import sequelize from "../../../database"

export class Template_Row extends Model {
    public id!: number
    public section_id!: number
    public key!: string
    public label!: string
    public description!: string
    public row_type!: string
}

Template_Row.init(
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
                model: "template_sections",
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
        modelName: "Template_Row",
        tableName: "template_rows",
        timestamps: false,
        underscored: true,
    },
)
