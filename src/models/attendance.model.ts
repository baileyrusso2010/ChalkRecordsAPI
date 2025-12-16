import { DataTypes, Model } from "sequelize"
import sequelize from "../database"

export class Attendance extends Model {
    public id!: number
    public student_id!: number // Foreign key to Student
    public present_count!: number // Foreign key to Course_Instance
    public absent_count!: number
    public tardy_count!: number
}

Attendance.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        enrollment_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        code: {
            type: DataTypes.CHAR(1),
            allowNull: true, //for unknown
        },
        attendance_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Attendance",
        tableName: "attendance",
        timestamps: false,
        underscored: true,
        indexes: [
            {
                fields: ["student_id", "attendance_date"],
            },
            {
                fields: ["enrollment_id", "attendance_date"],
            },
        ],
    }
)
