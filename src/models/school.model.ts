import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class School extends Model {}

School.init(
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
        district_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "district", // name of Target model
                key: "id", // key in Target model that we're referencing
            },
            onUpdate: "CASCADE",
            onDelete: "SET NULL",
        },
    },
    {
        sequelize,
        modelName: "School",
        tableName: "school",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
