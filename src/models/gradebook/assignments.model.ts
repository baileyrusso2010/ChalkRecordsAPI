import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Assignments extends Model {}

Assignments.init(
    {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true,
        },
        course_instance_id: {
            type: DataTypes.BIGINT,
            allowNull: false,
            references: {
                model: "course_instance",
                key: "id",
            },
        },
        grading_category_id: {
            type: DataTypes.BIGINT,
            allowNull: true,
            references: {
                model: "grading_categories",
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        due_date: {
            type: DataTypes.DATEONLY,
            allowNull: true,
        },
        total_points: {
            type: DataTypes.DECIMAL(8, 2),
            allowNull: false,
        },
        is_published: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        grade_by_question: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
        },
        position: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Assignments",
        tableName: "assignments",
        timestamps: true,
        underscored: true, // if you prefer snake_case for column names
    }
)
