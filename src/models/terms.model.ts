import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class Term extends Model {}

Term.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        schoolYearId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "school_year",
                key: "id",
            },

            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        startDate: { type: DataTypes.DATE, allowNull: false },
        endDate: { type: DataTypes.DATE, allowNull: false },
    },
    {
        sequelize,
        modelName: "Term",
        tableName: "term",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
