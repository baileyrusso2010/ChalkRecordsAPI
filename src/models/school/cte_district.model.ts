import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class CTE_District extends Model {}

CTE_District.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
        },
        contact_email: {
            type: DataTypes.STRING(100),
        },
        phone_number: {
            type: DataTypes.STRING(15),
        },
    },
    {
        sequelize,
        modelName: "CTE_District",
        tableName: "cte_district",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
