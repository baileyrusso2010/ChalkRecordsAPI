import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class CourseCatalog extends Model {}

CourseCatalog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        course_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        course_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        course_description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "CourseCatalog",
        tableName: "course_catalog",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
