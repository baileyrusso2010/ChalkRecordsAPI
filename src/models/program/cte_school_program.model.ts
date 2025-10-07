import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

//district level offering
export class CTE_School_Program extends Model {}

CTE_School_Program.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        cte_school_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "cte_school",
                key: "id",
            },
        },
        district_program_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "cte_district_program",
                key: "id",
            },
        },
        startDate: {
            type: DataTypes.DATE,
        },
        endDate: {
            type: DataTypes.DATE,
        },
        active: {
            type: DataTypes.BOOLEAN,
        },
    },
    {
        sequelize,
        modelName: "CTE_School_Program",
        tableName: "cte_school_program",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
