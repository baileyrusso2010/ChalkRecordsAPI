import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"
import { StudentFormSubmission } from "./student_form_submissions.model"

export class StudentFormSubmissionData extends Model {
    public submission_id!: number
    public data!: any
}

StudentFormSubmissionData.init(
    {
        submission_id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            references: {
                model: "student_form_submissions",
                key: "id",
            },
            onDelete: "CASCADE",
        },
        data: {
            type: DataTypes.JSONB,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "StudentFormSubmissionData",
        tableName: "student_form_submission_data",
        timestamps: false,
        underscored: true,
    }
)
