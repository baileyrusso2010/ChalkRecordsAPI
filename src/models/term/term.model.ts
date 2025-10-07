import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Term extends Model {}

Term.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        school_year_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "school_year",
                key: "id",
            },
        },
        name: {
            type: DataTypes.STRING(50),
        },
        startDate: {
            type: DataTypes.DATE,
        },
        endDate: {
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        modelName: "Term",
        tableName: "term",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
