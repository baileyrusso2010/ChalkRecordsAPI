import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Permissions extends Model {
    public id!: number
    public key!: string
    public description!: string
}

Permissions.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
        },
        key: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "Permissions",
        tableName: "permissions",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    },
)
