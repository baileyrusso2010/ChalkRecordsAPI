import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class RolePermissions extends Model {
    public role_id!: number
    public permission_id!: number
}

RolePermissions.init(
    {
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "roles",
                key: "id",
            },
        },
        permission_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "permissions",
                key: "id",
            },
        },
    },
    {
        sequelize,
        modelName: "RolePermissions",
        tableName: "role_permissions",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
        indexes: [
            {
                unique: true,
                fields: ["role_id", "permission_id"],
            },
        ],
    },
)
