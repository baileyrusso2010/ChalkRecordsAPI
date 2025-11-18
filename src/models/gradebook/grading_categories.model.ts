import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Grading_Categories extends Model {}

Grading_Categories.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
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
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        weight: {
            type: DataTypes.DECIMAL(5, 2),
        },
        position: {
            type: DataTypes.INTEGER,
        },
    },
    {
        sequelize,
        modelName: "Grading_Categories",
        tableName: "grading_categories",
        timestamps: true,
        underscored: true, // if you prefer snake_case for column names
    }
)
