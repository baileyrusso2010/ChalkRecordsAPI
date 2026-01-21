import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Evaluation_Section extends Model {
    public id!: number
    public document_id!: string
    public key!: string
    public label!: string
    public order!: number
}

Evaluation_Section.init(
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
        key: {
            // "cdos_performances, cdoes_technical, assessments"
            type: DataTypes.STRING,
            allowNull: false,
        },
        label: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        //order
    },
    {
        sequelize,
        modelName: "Evaluation_Section",
        tableName: "evaluation_sections",
        timestamps: false,
        underscored: true,
    },
)
