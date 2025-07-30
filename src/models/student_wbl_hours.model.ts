import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Student_WBL extends Model {}

Student_WBL.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "students",
                key: "id",
            },
        },
        wbl_type_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "wbl_types",
                key: "id",
            },
        },
        hours: {
            type: DataTypes.DECIMAL(10, 2), // Allows for decimal values
            allowNull: false,
            defaultValue: 0.0, // Default to 0 hours
        },
        notes: {
            type: DataTypes.TEXT,
            allowNull: true, // Notes can be optional
        },
        recorded_at: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Student_WBL_Hours",
        tableName: "student_wbl_hours",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
