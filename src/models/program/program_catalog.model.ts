import { Model, DataTypes } from "sequelize"
import sequelize from "../../database"

export class Program_Catalog extends Model {}

Program_Catalog.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        state_program_code: {
            type: DataTypes.STRING(50),
            allowNull: false,
        },
        title: {
            //not sure if needed since it has linkage
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        modelName: "Program_Catalog",
        tableName: "program_catalog",
        timestamps: false,
        underscored: true, // if you prefer snake_case for column names
    }
)
