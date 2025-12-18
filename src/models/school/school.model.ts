import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class School extends Model {
    public id!: number
    public district_id!: number
    public name!: string
    public address?: string
    public phone_number?: string
    public website?: string
}

School.init(
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
                model: "district",
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        address: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        phone_number: {
            type: DataTypes.STRING(50),
            allowNull: true
        },
        website: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
    },
    {
        sequelize,
        modelName: "School",
        tableName: "school",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
