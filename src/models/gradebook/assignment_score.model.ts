import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Assignment_Score extends Model {}

Assignment_Score.init(
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
        enrollment_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "enrollment",
                key: "id",
            },
        },
        points_earned: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: true,
        },
        is_excused: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_missing: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        is_late: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        comment: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Assignment_Score",
        tableName: "assignment_score",
        timestamps: true,
        underscored: true, // if you prefer snake_case for column names
    }
)
