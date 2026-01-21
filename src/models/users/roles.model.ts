import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Roles extends Model {
    public id!: number
    public name!: string
}
//links sso to user

Roles.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: "Roles",
        tableName: "roles",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
