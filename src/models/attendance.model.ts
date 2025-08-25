import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Attendance extends Model {}

Attendance.init(
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
        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "course",
                key: "id",
            },

            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },

        attenanceTypeId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "attendance_type",
                key: "id",
            },

            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Attendance",
        tableName: "attendance",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
