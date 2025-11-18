import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Assignment_Questions extends Model {}

Assignment_Questions.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        assignment_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "assignments",
                key: "id",
            },
        },
        question_number: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        max_points: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: false,
        },
        standards: {
            type: DataTypes.JSONB,
            allowNull: true,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Assignment_Questions",
        tableName: "assignment_questions",
        timestamps: true,
        underscored: true, // if you prefer snake_case for column names
    }
)
