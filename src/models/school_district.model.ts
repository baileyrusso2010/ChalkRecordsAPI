import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class SchoolDistricts extends Model {}

SchoolDistricts.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        abbreviation: {
            type: DataTypes.STRING,
            allowNull: true, // Optional field
        },
        cte_school_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "cte_schools", // name of Target model
                key: "id", // key in Target model that we're referencing
            },
        },
    },
    {
        sequelize,
        modelName: "SchoolDistrict",
        tableName: "school_districts",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
