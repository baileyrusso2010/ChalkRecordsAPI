import { DataTypes, Model } from "sequelize"
import sequelize from "../../../database"

export class Template_Column extends Model {
    public id!: number
    public section_id!: number
    public key!: string
    public label!: string
    public value_type!: string
    public config!: any
}

Template_Column.init(
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
        value_type: {
            type: DataTypes.STRING, //boolean, number, string
            allowNull: false,
        },
        config: {
            type: DataTypes.JSONB, //validation/options
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Template_Column",
        tableName: "template_columns",
        timestamps: false,
        underscored: true,
    },
)
