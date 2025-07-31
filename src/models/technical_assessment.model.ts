import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class TechnicalAssessment extends Model {}

TechnicalAssessment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "students", // Name of the referenced table
                key: "id", // Key in the referenced model
            },
        },
        jr_sem_1: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        jr_sem_2: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        sr_sem_1: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        sr_sem_2: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "TechnicalAssessment",
        tableName: "technical_assessments",
        timestamps: false, // if you want createdAt and updatedAt fields
    }
)
