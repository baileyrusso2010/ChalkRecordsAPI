import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class StudentFormSubmission extends Model {
    public id!: number
}

StudentFormSubmission.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        form_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "form",
                key: "id",
            },
        },
        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "students",
                key: "id",
            },
        },
        course_instance_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "course_instance",
                key: "id",
            },
        },
        status: {
            type: DataTypes.ENUM("draft", "completed"),
            allowNull: false,
            defaultValue: "draft",
        },
        //add everything else later
    },
    {
        sequelize,
        modelName: "StudentFormSubmission",
        tableName: "student_form_submissions",
        timestamps: true,
        underscored: true,
    }
)

import { StudentFormSubmissionData } from "./student_form_submission_data.model"

StudentFormSubmission.hasOne(StudentFormSubmissionData, {
    foreignKey: "submission_id",
    as: "data",
})
