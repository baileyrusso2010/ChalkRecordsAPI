import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Staff_Roles extends Model {
    public staff_id!: number
    public role_id!: number
}

Staff_Roles.init(
    {
        staff_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "staff",
                key: "id",
            },
        },
        role_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "roles",
                key: "id",
            },
        },
        scope_type: {
            type: DataTypes.ENUM("district", "school", "system"),
            allowNull: false,
        },
        scope_id: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }, //null when scope_type is system
    },
    {
        sequelize,
        modelName: "Staff_Roles",
        tableName: "staff_roles",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
        indexes: [
            {
                unique: true,
                fields: ["staff_id", "role_id"],
            },
        ],
    },
)
// staff ─── staff_roles ─── roles ─── role_permissions ─── permissions
