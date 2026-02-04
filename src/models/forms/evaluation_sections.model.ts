import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Evaluation_Section extends Model {
    public id!: number
    public document_id!: string
    public key!: string
    public label!: string
    public order!: number
    public section_type!: string
    public source_table!: string
    public uses_rubric!: boolean
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
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: true, //doesnt have to be required
        },
        uses_rubric: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        section_type: {
            type: DataTypes.ENUM("manual", "linked"),
            allowNull: true,
            defaultValue: "manual",
        },
        source_table: {
            //this is optional
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Evaluation_Section",
        tableName: "evaluation_sections",
        timestamps: false,
        underscored: true,
    },
)
