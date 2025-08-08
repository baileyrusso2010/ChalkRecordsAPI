import { DataTypes, Model } from "sequelize"
import sequelize from "../database"

export interface UserAttributes {
    id?: number
    email: string
    password: string
}

export class User extends Model<UserAttributes> implements UserAttributes {
    public id!: number
    public email!: string
    public password!: string
}

User.init(
    {
        id: {
            type: DataTypes.INTEGER.UNSIGNED,
            autoIncrement: true,
            primaryKey: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "User",
        tableName: "users",
        timestamps: false,
    }
)

export default User
