import { Model, DataTypes } from "sequelize"
import sequelize from "../database"
import { da } from "@faker-js/faker/."

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
        school_year: {
            type: DataTypes.STRING,
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
