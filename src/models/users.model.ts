import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Users extends Model {}

Users.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        email: {
            type: DataTypes.STRING,
        },
        name: {
            type: DataTypes.STRING,
        },
        role: {
            type: DataTypes.STRING,
        },
        school_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // null if not associated with a school
        },
        district_id: {
            type: DataTypes.INTEGER,
            allowNull: true, // null if not associated with distrct
        },
    },
    {
        sequelize,
        modelName: "Users",
        tableName: "users",
        timestamps: true, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
