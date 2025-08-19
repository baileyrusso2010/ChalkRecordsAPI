import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Course extends Model {}

Course.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        programId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "program_id",
            references: {
                model: "program",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        catalogId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "catalog_id",
            references: {
                model: "course_catalog",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        alias: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        school_year: {
            //change later
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Course",
        tableName: "course",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
