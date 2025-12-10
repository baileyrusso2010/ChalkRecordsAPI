import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Student_Assessment_Results extends Model {}

Student_Assessment_Results.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },

        student_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "students",
                key: "id",
            },
        },
        assessment_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "assessments",
                key: "id",
            },
        },
        raw_score: {
            type: DataTypes.FLOAT,
        },
        percent_score: {
            type: DataTypes.FLOAT,
        },
        band_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        is_passing: {
            type: DataTypes.BOOLEAN,
            allowNull: true,
        },
        raw_response: {
            type: DataTypes.JSONB,
            defaultValue: {},
        },
        taken_at: {
            type: DataTypes.DATE,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Student_Assessment_Results",
        tableName: "student_assessment_results",
        timestamps: true,
        underscored: true,
    }
)
