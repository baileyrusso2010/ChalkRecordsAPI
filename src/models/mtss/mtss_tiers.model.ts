import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class MTSS_Tiers extends Model {
    public id!: number
    public name!: string
    public description!: string
}

MTSS_Tiers.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "MTSS_Tiers",
        tableName: "mtss_tiers",
        timestamps: false,
        underscored: true,
    }
)
