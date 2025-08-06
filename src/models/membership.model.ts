import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Membership extends Model {}

Membership.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
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
