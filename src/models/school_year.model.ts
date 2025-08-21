import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class SchoolYear extends Model {}

SchoolYear.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
        },
        startDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        endDate: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        active: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        sequelize,
        modelName: "SchoolYear",
        tableName: "school_year",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
