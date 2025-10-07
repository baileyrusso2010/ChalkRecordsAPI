import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class School_Year extends Model {}

School_Year.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        district_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "cte_district",
                key: "id",
            },
        },
        startDate: {
            type: DataTypes.DATE,
        },
        endDate: {
            type: DataTypes.DATE,
        },
        label: {
            type: DataTypes.STRING(50),
        },

        //credits maybe.. wait on this
    },
    {
        sequelize,
        modelName: "School_Year",
        tableName: "school_year",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
