import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Flag extends Model {}

Flag.init(
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
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },

        //code if applicable
        //state reported
    },
    {
        sequelize,
        modelName: "Flag",
        tableName: "flag",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
