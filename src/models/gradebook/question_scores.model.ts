import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Question_Scores extends Model {}

Question_Scores.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        assignment_question_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "assignment_questions",
                key: "id",
            },
        },
        enrollment_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "enrollments",
                key: "id",
            },
        },
        points_earned: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Question_Scores",
        tableName: "question_scores",
        timestamps: true,
        underscored: true, // if you prefer snake_case for column names
    }
)
