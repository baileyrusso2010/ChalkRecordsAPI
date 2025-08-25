import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Grade extends Model {}

Grade.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },

        studentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "student",
                key: "id",
            },

            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        assignmentId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "assignment",
                key: "id",
            },

            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        score: {
            //might be issue later on if they want pass fail?
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        pass_fail: {
            type: DataTypes.BOOLEAN,
        },
        letter: {
            //optional
            type: DataTypes.CHAR(2),
        },
    },
    {
        sequelize,
        modelName: "Grade",
        tableName: "grade",
        timestamps: true,
        underscored: true, // if you prefer snake_case for column names
    }
)
