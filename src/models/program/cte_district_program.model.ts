import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

//district level offering
export class CTE_District_Program extends Model {}

CTE_District_Program.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        cte_district_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "cte_district",
                key: "id",
            },
        },
        program_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "program",
                key: "id",
            },
        },
        authorization_date: {
            type: DataTypes.DATE,
        },
        expiration_date: {
            type: DataTypes.DATE,
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
    },
    {
        sequelize,
        modelName: "CTE_District_Program",
        tableName: "cte_district_program",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
