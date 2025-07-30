import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class WBL_types extends Model {}

WBL_types.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true, // Assuming each WBL type has a unique name
        },
    },
    {
        sequelize,
        modelName: "WBL_types",
        tableName: "wbl_types",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
