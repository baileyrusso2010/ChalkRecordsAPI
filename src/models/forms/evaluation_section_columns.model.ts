import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Evaluation_Section_Columns extends Model {
    public id!: number
    public section_id!: number
    public key!: string
    public label!: string
    public value_type!: string
    public config!: any
}

Evaluation_Section_Columns.init(
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
        value_type: {
            type: DataTypes.STRING, //boolean, number, string
            allowNull: false,
        },
        use_rubric: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        config: {
            type: DataTypes.JSONB, //validation/options//maybe not needed
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Evaluation_Section_Columns",
        tableName: "evaluation_section_columns",
        timestamps: false,
        underscored: true,
    },
)
