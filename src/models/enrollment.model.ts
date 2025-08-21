import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Enrollment extends Model {}

Enrollment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "student",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        classId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "course",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        schoolYearId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "school_year",
                key: "id",
            },

            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
    },
    {
        sequelize,
        modelName: "Enrollment",
        tableName: "enrollment",
        // timestamps: true, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
