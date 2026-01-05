import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class MTSS_Tiers extends Model {
    public id!: number
    public tier_id!: number
    public tier_name!: string
    public description!: string
}

MTSS_Tiers.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        tier_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        tier_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "MTSS_Tiers",
        tableName: "mtss_tiers",
        timestamps: true,
        underscored: true,
    }
)
