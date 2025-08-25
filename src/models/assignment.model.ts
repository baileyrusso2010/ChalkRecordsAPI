import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Assignment extends Model {}

Assignment.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },

        courseId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "course",
                key: "id",
            },

            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        max_score: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        weight: {
            type: DataTypes.FLOAT,
            defaultValue: 1.0,
        },
        due_date: { type: DataTypes.DATE, allowNull: false },
    },
    {
        sequelize,
        modelName: "Assignment",
        tableName: "assignment",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
