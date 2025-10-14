import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class CTE_School extends Model {
    public id!: number
    public district_id!: number
    public name!: string
    public address!: string
    public phone_number!: string
    public website!: string
}

CTE_School.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        district_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "cte_district",
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
        },
        phone_number: {
            type: DataTypes.STRING(15),
        },
        website: {
            type: DataTypes.STRING(255),
        },
    },
    {
        sequelize,
        modelName: "CTE_School",
        tableName: "cte_school",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
