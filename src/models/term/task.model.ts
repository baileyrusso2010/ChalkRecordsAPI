import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Task extends Model {}

Task.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        term_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "term",
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING(50), //will be quarter 1, semester 1, etc
        },
    },
    {
        sequelize,
        modelName: "Task",
        tableName: "task",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
