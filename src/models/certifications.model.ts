import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Certification extends Model {}

Certification.init(
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
        color: {
            type: DataTypes.CHAR(7),
        },
        //code if applicable
        //state reported
    },
    {
        sequelize,
        modelName: "Certification",
        tableName: "certification",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
