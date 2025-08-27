import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Company extends Model {}

Company.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
        },
        notes: {
            type: DataTypes.STRING,
        },
    },
    {
        sequelize,
        modelName: "Company",
        tableName: "company",
        timestamps: false,
        underscored: true,
    }
)
