import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

import { Evaluation_Section } from "./evaluation_sections.model"

export class Evaluation_Document extends Model {
    public id!: number
    public class_id!: string
    public name!: string

    public sections?: Evaluation_Section[]
}

Evaluation_Document.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        class_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "course_instance",
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        //othe rattributes like school_year, term, created by, locked, etc, tenant
    },
    {
        sequelize,
        modelName: "Evaluation_Document",
        tableName: "evaluation_documents",
        timestamps: false,
        underscored: true,
    },
)
