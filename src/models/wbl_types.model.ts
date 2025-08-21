import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class WBLTypes extends Model {}

WBLTypes.init(
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
    },
    {
        sequelize,
        modelName: "WBLTypes",
        tableName: "wbl_types",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
