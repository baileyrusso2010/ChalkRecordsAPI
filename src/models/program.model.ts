import { Model, DataTypes } from "sequelize"
import sequelize from "../database"
import { da } from "@faker-js/faker/."

export class Program extends Model {}

Program.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        programCatalogId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            field: "program_catalog_id",
            references: {
                model: "program_catalog",
                key: "id",
            },
            onUpdate: "CASCADE",
            onDelete: "RESTRICT",
        },
        active: {
            type: DataTypes.BOOLEAN,
            defaultValue: true,
        },
        original_approval_date: {
            type: DataTypes.DATE,
            // allowNull: true
        },
        approved_through: {
            type: DataTypes.DATE,
        },
    },
    {
        sequelize,
        modelName: "CTEProgram",
        tableName: "cte_programs",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
