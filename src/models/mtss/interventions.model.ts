import { DataTypes, Model } from "sequelize"
import sequelize from "../../database"

export class Interventions extends Model {
    public id!: number
    public name!: string
    public domain_id!: number
    public tier_id!: number
    public description!: string
    public frequency!: string
    public duration!: string
}

Interventions.init(
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
        domain_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "mtss_domains",
                key: "id",
            },
        },
        tier_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "mtss_tiers",
                key: "id",
            },
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        frequency: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "Interventions",
        tableName: "interventions",
        timestamps: true,
        underscored: true,
    }
)
