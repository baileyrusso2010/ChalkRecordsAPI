import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Scoring_Bands extends Model {}

Scoring_Bands.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        assessment_id: {
            type: DataTypes.INTEGER,
            references: {
                model: "assessments",
                key: "id",
            },
        },
        band_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        min_score: {
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        max_score: {
            //allow null for pass/fail
            type: DataTypes.FLOAT,
            allowNull: true,
        },
        color: {
            type: DataTypes.TEXT,
        },
    },
    {
        sequelize,
        modelName: "Scoring_Bands",
        tableName: "scoring_bands",
        timestamps: true,
        underscored: true,
    }
)
