import { DataTypes, Model } from "sequelize"
import sequelize from "../database"

export class Enrollment extends Model {
    public id!: number
    public student_id!: number // Foreign key to Student
    public course_instance_id!: number // Foreign key to Course_Instance
    public enrollment_date!: Date
}

Enrollment.init(
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
        course_instance_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        enrollment_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
            defaultValue: DataTypes.NOW,
        },
    },
    {
        sequelize,
        modelName: "Enrollment",
        tableName: "enrollments",
        timestamps: true,
        underscored: true,
    }
)
