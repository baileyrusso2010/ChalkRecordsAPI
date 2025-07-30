import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Grades extends Model {}

Grades.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        junior_grade: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        senior_grade: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Grades",
        tableName: "grades",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
