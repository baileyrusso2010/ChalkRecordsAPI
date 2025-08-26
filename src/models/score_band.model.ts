import { Model, DataTypes } from "sequelize"
import sequelize from "../database"

export class ScoreBand extends Model {}

ScoreBand.init(
    {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        min_score: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        max_score: {
            type: DataTypes.NUMBER,
            allowNull: false,
        },
        color_hex: {
            type: DataTypes.CHAR(7),
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "ScoreBand",
        tableName: "score_band",
        timestamps: false, // if you want createdAt and updatedAt fields
        underscored: true, // if you prefer snake_case for column names
    }
)
