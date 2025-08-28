import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Student extends Model {
    public id!: number
    public firstName!: string
    public lastName!: string
    public email!: string
    public grade?: string
}

Student.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        email: {
            type: DataTypes.STRING,
            unique: true,
        },
        grade: {
            type: DataTypes.STRING,
            allowNull: true, //some edge cases
        },
    },
    {
        sequelize,
        modelName: "Student",
        tableName: "student",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
